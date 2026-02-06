# Jira MCP Server

[![npm version](https://badge.fury.io/js/%40carmeloricarte%2Fjira-mcp-server.svg)](https://www.npmjs.com/package/@carmeloricarte/jira-mcp-server)

A Model Context Protocol (MCP) server for Jira Cloud that enables AI assistants to interact with Jira issues.

## Features

| Tool | Description |
|------|-------------|
| **create_issue** | Create a new Jira issue (Story, Bug, Task, Epic, etc.) |
| **get_issue** | Get detailed information about a specific Jira issue |
| **list_issues** | Search for issues using JQL (Jira Query Language) |
| **get_issue_fields** | Get all fields (including custom fields) for an issue |
| **update_issue** | Update an existing issue (summary, description, assignee, priority, labels, custom fields) |
| **add_comment** | Add a comment to a Jira issue |
| **get_transitions** | Get available status transitions for an issue |
| **transition_issue** | Transition an issue to a new status |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ **or** [Bun](https://bun.sh/) runtime
- Jira Cloud account with API access
- API token from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

## Installation

The easiest way to use this MCP server is via `npx` or `bunx` - no installation required! Just configure your MCP client as shown below.

If you prefer to install globally:

```bash
# Using npm
npm install -g @carmeloricarte/jira-mcp-server

# Using Bun
bun install -g @carmeloricarte/jira-mcp-server
```

## Environment Variables

> **Important:** You do NOT need to set environment variables at the system or user level. The MCP client will pass them to the server process when it starts. Just configure them in the `env` object of your MCP configuration.

| Variable | Description | Example |
|----------|-------------|---------|
| `JIRA_HOST` | Your Jira Cloud domain (without https://) | `your-company.atlassian.net` |
| `JIRA_EMAIL` | Email associated with your Atlassian account | `user@example.com` |
| `JIRA_API_TOKEN` | API token generated from Atlassian | `ATATT3xF...` |

---

## MCP Client Configuration

> **Note:** All examples below use `npx` (Node.js). If you prefer Bun, replace `"command": "npx"` with `"command": "bunx"` and remove the `"-y"` from args.

### ⚠️ Windows Configuration

On Windows, you must wrap `npx` or `bunx` commands with `cmd /c`. Use this format:

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@carmeloricarte/jira-mcp-server"]
}
```

Or with Bun:

```json
{
  "command": "cmd",
  "args": ["/c", "bunx", "@carmeloricarte/jira-mcp-server"]
}
```

> **Important:** The package name must always be the **last argument** in the args array.

---

### Claude Code

**Config file location:**
- **macOS/Linux:** `~/.claude/settings.json`
- **Windows:** `%USERPROFILE%\.claude\settings.json`

```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

### VS Code (Copilot MCP Extension)

**Config file location:**
- **macOS/Linux:** `~/.vscode/mcp.json` or workspace `.vscode/mcp.json`
- **Windows:** `%USERPROFILE%\.vscode\mcp.json` or workspace `.vscode\mcp.json`

```json
{
  "servers": {
    "jira": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

### Cursor

**Config file location:**
- **macOS:** `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp.json`
- **Windows:** `%APPDATA%\Cursor\User\globalStorage\cursor.mcp\mcp.json`

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

### Zed

**Config file location:**
- **macOS:** `~/.config/zed/settings.json`
- **Windows:** `%APPDATA%\Zed\settings.json`

```json
{
  "language_models": {
    "mcp_servers": {
      "jira": {
        "command": "npx",
        "args": ["-y", "@carmeloricarte/jira-mcp-server"],
        "env": {
          "JIRA_HOST": "your-company.atlassian.net",
          "JIRA_EMAIL": "your-email@example.com",
          "JIRA_API_TOKEN": "your-api-token"
        }
      }
    }
  }
}
```

---

### OpenCode

**Config file location:**
- **macOS/Linux:** `~/.config/opencode/config.json`
- **Windows:** `%USERPROFILE%\.config\opencode\config.json`

```json
{
  "mcp_servers": {
    "jira": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

### Codex (OpenAI CLI)

**Config file location:**
- **macOS/Linux:** `~/.codex/config.json`
- **Windows:** `%USERPROFILE%\.codex\config.json`

```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

### Windsurf (Codeium)

**Config file location:**
- **macOS:** `~/.codeium/windsurf/mcp_config.json`
- **Windows:** `%USERPROFILE%\.codeium\windsurf\mcp_config.json`

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@carmeloricarte/jira-mcp-server"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

## Tool Examples

### Create Issue

```
Create a new Story in project PROJ with title "Implement user authentication"
```

```
Create an Epic in PROJ called "[EPIC] Payment System" with description "Complete payment integration"
```

### Get Issue

```
Get issue PROJ-123
```

### Search Issues with JQL

```
Search for issues: project = PROJ AND status = "In Progress"
```

### Update Issue

```
Update PROJ-123: change priority to High and add labels "urgent", "frontend"
```

```
Update the description of PROJ-123 to "Updated requirements..."
```

### Add Comment

```
Add comment "Working on this now" to PROJ-123
```

### Transition Issue

```
Move PROJ-123 to "In Progress"
```

---

## Development

### Clone and install dependencies

```bash
git clone https://github.com/carmeloricarte/jira-mcp-server.git
cd jira-mcp-server
bun install
```

### Run tests

```bash
bun test
```

### Run tests with coverage

```bash
bun test --coverage
```

### Run the server standalone

```bash
JIRA_HOST=your-company.atlassian.net \
JIRA_EMAIL=your-email@example.com \
JIRA_API_TOKEN=your-token \
bun run start
```

---

## Troubleshooting

### Server not starting

1. Verify Node.js 18+ or Bun is installed: `node --version` or `bun --version`
2. Try running manually: `npx -y @carmeloricarte/jira-mcp-server` or `bunx @carmeloricarte/jira-mcp-server`
3. Check for any error messages in your MCP client logs

### Authentication errors

1. Verify your API token is valid at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Ensure `JIRA_HOST` does not include `https://`
3. Verify `JIRA_EMAIL` matches the email used to generate the token

### Empty results from list_issues

The server includes default fields (summary, status, priority, issuetype, assignee, updated). If you need additional fields, pass them in the `fields` parameter.

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/carmeloricarte/jira-mcp-server/issues) with as much detail as possible.

---

## License

MIT
