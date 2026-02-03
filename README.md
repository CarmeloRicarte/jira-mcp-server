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
git clone <repo-url>
cd jira-mcp-server
bun install
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

### Claude Code

**Config file location:**
- **macOS/Linux:** `~/.claude/settings.json`
- **Windows:** `%USERPROFILE%\.claude\settings.json`

**macOS/Linux:**
```json
{
  "mcpServers": {
    "Jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
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

---

### VS Code (Copilot MCP Extension)

**Config file location:**
- **macOS/Linux:** `~/.vscode/mcp.json` or workspace `.vscode/mcp.json`
- **Windows:** `%USERPROFILE%\.vscode\mcp.json` or workspace `.vscode\mcp.json`

**macOS/Linux:**
```json
{
  "servers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
```json
{
  "servers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

**macOS:**
```json
{
  "mcpServers": {
    "jira": {
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "jira": {
      "command": "bun",
      "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

**macOS:**
```json
{
  "language_models": {
    "mcp_servers": {
      "jira": {
        "command": "bun",
        "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
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

**Windows:**
```json
{
  "language_models": {
    "mcp_servers": {
      "jira": {
        "command": "bun",
        "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

**macOS/Linux:**
```json
{
  "mcp_servers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcp_servers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

**macOS/Linux:**
```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

**macOS:**
```json
{
  "mcpServers": {
    "jira": {
      "command": "bun",
      "args": ["run", "/Users/youruser/path/to/jira-mcp-server/src/index.ts"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "jira": {
      "command": "bun",
      "args": ["run", "C:\\dev\\mcps\\jira-mcp-server\\src\\index.ts"],
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

---

## Development

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

1. Verify Bun is installed: `bun --version`
2. Verify dependencies are installed: `bun install`
3. Check the path to `index.ts` is correct in your config

### Authentication errors

1. Verify your API token is valid at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Ensure `JIRA_HOST` does not include `https://`
3. Verify `JIRA_EMAIL` matches the email used to generate the token

### Empty results from list_issues

The server includes default fields (summary, status, priority, issuetype, assignee, updated). If you need additional fields, pass them in the `fields` parameter.

---

## License

MIT
