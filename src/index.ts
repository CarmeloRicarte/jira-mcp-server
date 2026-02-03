#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createJiraClientFromEnv } from "./client/jira-client";
import { createMcpServer } from "./server";

async function main(): Promise<void> {
  try {
    // Create Jira client from environment variables
    const client = createJiraClientFromEnv();

    // Create MCP server with the client
    const server = createMcpServer(client);

    // Connect via stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Jira MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
