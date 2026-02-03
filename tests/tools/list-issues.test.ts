import { describe, it, expect, mock, beforeEach } from "bun:test";
import { listIssues } from "../../src/tools/list-issues.js";
import type { JiraClient } from "../../src/client/jira-client.js";
import type { JiraSearchResult } from "../../src/types/jira.js";

describe("listIssues", () => {
  const mockSearchResult: JiraSearchResult = {
    maxResults: 20,
    total: 2,
    issues: [
      {
        id: "10001",
        key: "PROJ-123",
        self: "https://test.atlassian.net/rest/api/3/issue/10001",
        fields: {
          summary: "First Issue",
          description: null,
          status: {
            id: "1",
            name: "To Do",
            statusCategory: {
              id: 2,
              key: "new",
              name: "To Do",
              colorName: "blue-gray",
            },
          },
          priority: { id: "3", name: "High" },
          issuetype: { id: "10001", name: "Bug", subtask: false },
          assignee: { accountId: "123", displayName: "John Doe", active: true },
          project: { id: "10000", key: "PROJ", name: "Test" },
          created: "2024-01-15T10:00:00.000Z",
          updated: "2024-01-16T15:30:00.000Z",
        },
      },
      {
        id: "10002",
        key: "PROJ-124",
        self: "https://test.atlassian.net/rest/api/3/issue/10002",
        fields: {
          summary: "Second Issue",
          description: null,
          status: {
            id: "2",
            name: "In Progress",
            statusCategory: {
              id: 4,
              key: "indeterminate",
              name: "In Progress",
              colorName: "yellow",
            },
          },
          priority: { id: "4", name: "Medium" },
          issuetype: { id: "10002", name: "Story", subtask: false },
          assignee: null,
          project: { id: "10000", key: "PROJ", name: "Test" },
          created: "2024-01-14T10:00:00.000Z",
          updated: "2024-01-17T09:00:00.000Z",
        },
      },
    ],
    nextPageToken: "eyJhbGciOiJIUzI1NiJ9.test",
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      searchIssues: mock(() => Promise.resolve(mockSearchResult)),
    } as unknown as JiraClient;
  });

  it("should return formatted search results", async () => {
    const result = await listIssues(mockClient, {
      jql: 'project = PROJ AND status = "To Do"',
    });
    const parsed = JSON.parse(result);

    expect(parsed.total).toBe(2);
    expect(parsed.issues).toHaveLength(2);
    expect(parsed.issues[0].key).toBe("PROJ-123");
    expect(parsed.issues[0].summary).toBe("First Issue");
    expect(parsed.issues[0].status).toBe("To Do");
  });

  it("should handle unassigned issues in results", async () => {
    const result = await listIssues(mockClient, { jql: "project = PROJ" });
    const parsed = JSON.parse(result);

    expect(parsed.issues[1].assignee).toBe("Unassigned");
  });

  it("should limit max_results to 100", async () => {
    const searchMock = mock(() => Promise.resolve(mockSearchResult));
    mockClient.searchIssues = searchMock;

    await listIssues(mockClient, {
      jql: "project = PROJ",
      max_results: 200,
    });

    expect(searchMock).toHaveBeenCalledWith("project = PROJ", {
      maxResults: 100,
      fields: ["summary", "status", "priority", "issuetype", "assignee", "updated"],
      nextPageToken: undefined,
    });
  });

  it("should pass pagination token", async () => {
    const searchMock = mock(() => Promise.resolve(mockSearchResult));
    mockClient.searchIssues = searchMock;

    await listIssues(mockClient, {
      jql: "project = PROJ",
      next_page_token: "eyJhbGciOiJIUzI1NiJ9.page2",
      max_results: 25,
    });

    expect(searchMock).toHaveBeenCalledWith("project = PROJ", {
      maxResults: 25,
      fields: ["summary", "status", "priority", "issuetype", "assignee", "updated"],
      nextPageToken: "eyJhbGciOiJIUzI1NiJ9.page2",
    });
  });

  it("should pass custom fields option", async () => {
    const searchMock = mock(() => Promise.resolve(mockSearchResult));
    mockClient.searchIssues = searchMock;

    await listIssues(mockClient, {
      jql: "project = PROJ",
      fields: ["summary", "status", "customfield_10001"],
    });

    expect(searchMock).toHaveBeenCalledWith("project = PROJ", {
      maxResults: 20,
      fields: ["summary", "status", "customfield_10001"],
      nextPageToken: undefined,
    });
  });

  it("should include nextPageToken in response", async () => {
    const result = await listIssues(mockClient, { jql: "project = PROJ" });
    const parsed = JSON.parse(result);

    expect(parsed.nextPageToken).toBe("eyJhbGciOiJIUzI1NiJ9.test");
  });
});
