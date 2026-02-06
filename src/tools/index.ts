import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JiraClient } from "../client/jira-client";
import { registerCommentTools } from "./comments";
import { registerIssueTools } from "./issues";
import { registerTransitionTools } from "./transitions";

export function registerAllTools(server: McpServer, client: JiraClient) {
  registerIssueTools(server, client);
  registerTransitionTools(server, client);
  registerCommentTools(server, client);
}
