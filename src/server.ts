import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "./client/jira-client";
import {
  addComment,
  addCommentSchema,
  createIssue,
  createIssueSchema,
  getIssue,
  getIssueFields,
  getIssueFieldsSchema,
  getIssueSchema,
  getTransitions,
  getTransitionsSchema,
  listIssues,
  listIssuesSchema,
  transitionIssue,
  transitionIssueSchema,
  updateIssue,
  updateIssueSchema,
} from "./tools";

export function createMcpServer(client: JiraClient): McpServer {
  const server = new McpServer({
    name: "jira-cloud",
    version: "1.0.0",
  });

  // Tool: Create Issue
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

  // Tool: Get Issue
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

  // Tool: List Issues (JQL Search)
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

  // Tool: Get Issue Fields (including custom fields)
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

  // Tool: Add Comment
  server.registerTool(
    "add_comment",
    {
      description: "Add a comment to a Jira issue",
      inputSchema: addCommentSchema,
    },
    async (input) => {
      try {
        const result = await addComment(client, input);
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

  // Tool: Get Transitions
  server.registerTool(
    "get_transitions",
    {
      description: "Get available status transitions for an issue",
      inputSchema: getTransitionsSchema,
    },
    async (input) => {
      try {
        const result = await getTransitions(client, input);
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

  // Tool: Transition Issue
  server.registerTool(
    "transition_issue",
    {
      description: "Transition an issue to a new status",
      inputSchema: transitionIssueSchema,
    },
    async (input) => {
      try {
        const result = await transitionIssue(client, input);
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

  // Tool: Update Issue
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

  return server;
}
