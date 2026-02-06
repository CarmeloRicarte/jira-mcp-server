import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { JiraClient } from "./client/jira-client";
import { config } from "./config";
import { registerAllTools } from "./tools";

const SERVER_NAME = "jira-cloud";
const SERVER_VERSION = "1.0.0";

export function createServer(client?: JiraClient): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  const jiraClient = client ?? JiraClient.fromConfig(config);
  registerAllTools(server, jiraClient);

  return server;
}
