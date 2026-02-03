# Jira MCP Server

A Model Context Protocol (MCP) server for Jira Cloud that enables AI assistants to interact with Jira issues.

## Features

- **get_issue** - Get detailed information about a specific Jira issue
- **list_issues** - Search for issues using JQL (Jira Query Language)
- **get_issue_fields** - Get all fields (including custom fields) for an issue
- **add_comment** - Add a comment to a Jira issue
- **get_transitions** - Get available status transitions for an issue
- **transition_issue** - Transition an issue to a new status

## Prerequisites

- [Bun](https://bun.sh/) runtime
- Jira Cloud account with API access
- API token from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

## Installation

```bash
bun install
```

## Configuration

Set the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `JIRA_HOST` | Your Jira Cloud domain | `your-company.atlassian.net` |
| `JIRA_EMAIL` | Email associated with your Atlassian account | `user@example.com` |
| `JIRA_API_TOKEN` | API token generated from Atlassian | `ATATT3xF...` |

## Usage

### Running the server

```bash
bun run start
```

### Claude Code Configuration

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "Jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "C:/dev/mcps/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Tool Examples

### Get Issue

```
Get issue PROJ-123
```

### Search Issues with JQL

```
Search for issues: project = PROJ AND status = "In Progress"
```

### Add Comment

```
Add comment "Working on this now" to PROJ-123
```

### Transition Issue

```
Move PROJ-123 to "In Progress"
```

## Development

### Run tests

```bash
bun test
```

### Run tests with coverage

```bash
bun test --coverage
```

## License

MIT
