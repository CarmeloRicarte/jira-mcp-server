import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "../client/jira-client";
import { addComment, addCommentSchema } from "./add-comment";

export function registerCommentTools(server: McpServer, client: JiraClient) {
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
}
