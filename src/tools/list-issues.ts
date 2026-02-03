import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const listIssuesSchema = {
  jql: z.string().describe("JQL query to search issues"),
  max_results: z
    .number()
    .optional()
    .default(20)
    .describe("Maximum number of results (default: 20, max: 100)"),
  next_page_token: z
    .string()
    .optional()
    .describe("Token for pagination (from previous response)"),
  fields: z
    .array(z.string())
    .optional()
    .describe("Specific fields to retrieve"),
};

export type ListIssuesInput = z.infer<z.ZodObject<typeof listIssuesSchema>>;

const DEFAULT_FIELDS = [
  "summary",
  "status",
  "priority",
  "issuetype",
  "assignee",
  "updated",
];

export async function listIssues(
  client: JiraClient,
  input: ListIssuesInput
): Promise<string> {
  const maxResults = Math.min(input.max_results ?? 20, 100);
  const fields = input.fields ?? DEFAULT_FIELDS;

  const result = await client.searchIssues(input.jql, {
    maxResults,
    fields,
    nextPageToken: input.next_page_token,
  });

  const issues = result.issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? "No summary",
    status: issue.fields?.status?.name ?? "Unknown",
    priority: issue.fields?.priority?.name ?? "None",
    issuetype: issue.fields?.issuetype?.name ?? "Unknown",
    assignee: issue.fields?.assignee?.displayName ?? "Unassigned",
    updated: issue.fields?.updated ?? null,
  }));

  return JSON.stringify(
    {
      total: result.total,
      maxResults: result.maxResults,
      nextPageToken: result.nextPageToken,
      issues,
    },
    null,
    2
  );
}
