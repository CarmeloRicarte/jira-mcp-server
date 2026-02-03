import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "./client/jira-client";
import {
  getIssue,
  getIssueSchema,
  listIssues,
  listIssuesSchema,
  getIssueFields,
  getIssueFieldsSchema,
  addComment,
  addCommentSchema,
  getTransitions,
  getTransitionsSchema,
  transitionIssue,
  transitionIssueSchema,
} from "./tools";

export function createMcpServer(client: JiraClient): McpServer {
  const server = new McpServer({
    name: "jira-cloud",
    version: "1.0.0",
  });

  // Tool: Get Issue
  server.tool(
    "get_issue",
    "Get detailed information about a specific Jira issue",
    getIssueSchema,
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
    }
  );

  // Tool: List Issues (JQL Search)
  server.tool(
    "list_issues",
    "Search for issues using JQL (Jira Query Language)",
    listIssuesSchema,
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
    }
  );

  // Tool: Get Issue Fields (including custom fields)
  server.tool(
    "get_issue_fields",
    "Get all fields (including custom fields) for an issue with their names and values",
    getIssueFieldsSchema,
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
    }
  );

  // Tool: Add Comment
  server.tool(
    "add_comment",
    "Add a comment to a Jira issue",
    addCommentSchema,
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
    }
  );

  // Tool: Get Transitions
  server.tool(
    "get_transitions",
    "Get available status transitions for an issue",
    getTransitionsSchema,
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
    }
  );

  // Tool: Transition Issue
  server.tool(
    "transition_issue",
    "Transition an issue to a new status",
    transitionIssueSchema,
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
    }
  );

  return server;
}
