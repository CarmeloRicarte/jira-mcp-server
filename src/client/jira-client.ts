import type { Config } from "../config";
import type {
  JiraAdfDocument,
  JiraComment,
  JiraConfig,
  JiraCreateIssueInput,
  JiraCreateIssueResponse,
  JiraIssue,
  JiraSearchResult,
  JiraTransitionsResponse,
  JiraUpdateIssueInput,
} from "../types/jira";

export class JiraClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = "JiraClientError";
  }
}

export class JiraClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(readonly config: JiraConfig) {
    this.baseUrl = `https://${config.host}/rest/api/3`;
    this.authHeader = this.createAuthHeader(config.email, config.apiToken);
  }

  static fromConfig(config: Config): JiraClient {
    return new JiraClient({
      host: config.host,
      email: config.email,
      apiToken: config.apiToken,
    });
  }

  private createAuthHeader(email: string, token: string): string {
    const credentials = Buffer.from(`${email}:${token}`).toString("base64");
    return `Basic ${credentials}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new JiraClientError(
        `Jira API error: ${errorBody}`,
        response.status,
        endpoint,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get a single issue by key or ID
   */
  async getIssue(
    issueIdOrKey: string,
    fields?: string[],
    expand?: string[],
  ): Promise<JiraIssue> {
    const params = new URLSearchParams();

    if (fields?.length) {
      params.set("fields", fields.join(","));
    }
    if (expand?.length) {
      params.set("expand", expand.join(","));
    }

    const queryString = params.toString();
    const endpoint = `/issue/${issueIdOrKey}${queryString ? `?${queryString}` : ""}`;

    return this.request<JiraIssue>(endpoint);
  }

  /**
   * Search issues using JQL
   * Note: Uses the new /search/jql endpoint which requires nextPageToken for pagination
   * instead of the deprecated startAt parameter
   */
  async searchIssues(
    jql: string,
    options: {
      maxResults?: number;
      fields?: string[];
      expand?: string[];
      nextPageToken?: string;
    } = {},
  ): Promise<JiraSearchResult> {
    const { maxResults = 50, fields, expand, nextPageToken } = options;

    const body: Record<string, unknown> = {
      jql,
      maxResults,
    };

    if (fields?.length) {
      body.fields = fields;
    }
    if (expand?.length) {
      body.expand = expand.join(",");
    }
    if (nextPageToken) {
      body.nextPageToken = nextPageToken;
    }

    return this.request<JiraSearchResult>("/search/jql", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Add a comment to an issue
   */
  async addComment(
    issueIdOrKey: string,
    body: string | JiraAdfDocument,
  ): Promise<JiraComment> {
    const commentBody = typeof body === "string" ? this.textToAdf(body) : body;

    return this.request<JiraComment>(`/issue/${issueIdOrKey}/comment`, {
      method: "POST",
      body: JSON.stringify({ body: commentBody }),
    });
  }

  /**
   * Get available transitions for an issue
   */
  async getTransitions(issueIdOrKey: string): Promise<JiraTransitionsResponse> {
    return this.request<JiraTransitionsResponse>(
      `/issue/${issueIdOrKey}/transitions`,
    );
  }

  /**
   * Transition an issue to a new status
   */
  async transitionIssue(
    issueIdOrKey: string,
    transitionId: string,
    comment?: string,
  ): Promise<void> {
    const body: Record<string, unknown> = {
      transition: { id: transitionId },
    };

    if (comment) {
      body.update = {
        comment: [{ add: { body: this.textToAdf(comment) } }],
      };
    }

    await this.request<void>(`/issue/${issueIdOrKey}/transitions`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Get all fields (including custom fields) metadata
   */
  async getFields(): Promise<
    Array<{ id: string; name: string; custom: boolean; schema?: unknown }>
  > {
    return this.request("/field");
  }

  /**
   * Create a new issue
   */
  async createIssue(input: JiraCreateIssueInput): Promise<JiraCreateIssueResponse> {
    const fields: Record<string, unknown> = {
      project: { key: input.project_key },
      summary: input.summary,
      issuetype: { name: input.issue_type },
    };

    if (input.description) {
      fields.description = this.textToAdf(input.description);
    }
    if (input.assignee_id) {
      fields.assignee = { accountId: input.assignee_id };
    }
    if (input.priority) {
      fields.priority = { name: input.priority };
    }
    if (input.labels) {
      fields.labels = input.labels;
    }
    if (input.parent_key) {
      fields.parent = { key: input.parent_key };
    }
    if (input.additional_fields) {
      Object.assign(fields, input.additional_fields);
    }

    return this.request<JiraCreateIssueResponse>("/issue", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });
  }

  /**
   * Update an existing issue
   */
  async updateIssue(input: JiraUpdateIssueInput): Promise<void> {
    const fields: Record<string, unknown> = {};

    if (input.summary !== undefined) {
      fields.summary = input.summary;
    }
    if (input.description !== undefined) {
      fields.description = input.description ? this.textToAdf(input.description) : null;
    }
    if (input.assignee_id !== undefined) {
      fields.assignee = input.assignee_id ? { accountId: input.assignee_id } : null;
    }
    if (input.priority !== undefined) {
      fields.priority = input.priority ? { name: input.priority } : null;
    }
    if (input.labels !== undefined) {
      fields.labels = input.labels;
    }
    if (input.additional_fields) {
      Object.assign(fields, input.additional_fields);
    }

    await this.request<void>(`/issue/${input.issue_key}`, {
      method: "PUT",
      body: JSON.stringify({ fields }),
    });
  }

  /**
   * Convert plain text to Atlassian Document Format (ADF)
   */
  textToAdf(text: string): JiraAdfDocument {
    const paragraphs = text.split("\n\n").filter(Boolean);

    return {
      type: "doc",
      version: 1,
      content: paragraphs.map((paragraph) => ({
        type: "paragraph",
        content: [{ type: "text", text: paragraph.replace(/\n/g, " ") }],
      })),
    };
  }

  /**
   * Convert ADF document to plain text
   */
  adfToText(adf: JiraAdfDocument | string | null | undefined): string {
    if (!adf) return "";
    if (typeof adf === "string") return adf;

    const extractText = (node: {
      type: string;
      content?: unknown[];
      text?: string;
    }): string => {
      if (node.text) return node.text;
      if (!node.content || !Array.isArray(node.content)) return "";
      return node.content
        .map((child) =>
          extractText(
            child as { type: string; content?: unknown[]; text?: string },
          ),
        )
        .join("\n");
    };

    return extractText(adf);
  }
}

/**
 * Create a JiraClient from environment variables
 */
export function createJiraClientFromEnv(): JiraClient {
  const host = process.env.JIRA_HOST;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!host) {
    throw new Error("JIRA_HOST environment variable is required");
  }
  if (!email) {
    throw new Error("JIRA_EMAIL environment variable is required");
  }
  if (!apiToken) {
    throw new Error("JIRA_API_TOKEN environment variable is required");
  }

  return new JiraClient({ host, email, apiToken });
}
