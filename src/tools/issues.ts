import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "../client/jira-client";
import { createIssue, createIssueSchema } from "./create-issue";
import { getIssue, getIssueSchema } from "./get-issue";
import { getIssueFields, getIssueFieldsSchema } from "./get-issue-fields";
import { listIssues, listIssuesSchema } from "./list-issues";
import { updateIssue, updateIssueSchema } from "./update-issue";

export function registerIssueTools(server: McpServer, client: JiraClient) {
  server.registerTool(
    "create_issue",
    {
      description:
        "Create a new Jira issue (Story, Bug, Task, Epic, etc.)",
      inputSchema: createIssueSchema,
    },
    async (input) => {
      try {
        const result = await createIssue(client, input);
        return { content: [{ type: "text", text: result }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_issue",
    {
      description: "Get detailed information about a specific Jira issue",
      inputSchema: getIssueSchema,
    },
    async (input) => {
      try {
        const result = await getIssue(client, input);
        return { content: [{ type: "text", text: result }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_issues",
    {
      description: "Search for issues using JQL (Jira Query Language)",
      inputSchema: listIssuesSchema,
    },
    async (input) => {
      try {
        const result = await listIssues(client, input);
        return { content: [{ type: "text", text: result }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_issue_fields",
    {
      description:
        "Get all fields (including custom fields) for an issue with their names and values",
      inputSchema: getIssueFieldsSchema,
    },
    async (input) => {
      try {
        const result = await getIssueFields(client, input);
        return { content: [{ type: "text", text: result }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_issue",
    {
      description:
        "Update an existing Jira issue (summary, description, assignee, priority, labels, custom fields)",
      inputSchema: updateIssueSchema,
    },
    async (input) => {
      try {
        const result = await updateIssue(client, input);
        return { content: [{ type: "text", text: result }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );
}
