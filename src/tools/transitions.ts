import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "../client/jira-client";
import {
  getTransitions,
  getTransitionsSchema,
  transitionIssue,
  transitionIssueSchema,
} from "./transition-issue";

export function registerTransitionTools(server: McpServer, client: JiraClient) {
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
}
