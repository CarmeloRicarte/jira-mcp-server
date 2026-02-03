import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getIssue } from "../../src/tools/get-issue.js";
import type { JiraClient } from "../../src/client/jira-client.js";
import type { JiraIssue } from "../../src/types/jira.js";

describe("getIssue", () => {
  const mockIssue: JiraIssue = {
    id: "10001",
    key: "PROJ-123",
    self: "https://test.atlassian.net/rest/api/3/issue/10001",
    fields: {
      summary: "Test Issue Summary",
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Test description" }],
          },
        ],
      },
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
      priority: {
        id: "3",
        name: "Medium",
      },
      issuetype: {
        id: "10001",
        name: "Story",
        subtask: false,
      },
      assignee: {
        accountId: "123",
        displayName: "John Doe",
        active: true,
      },
      reporter: {
        accountId: "456",
        displayName: "Jane Smith",
        active: true,
      },
      project: {
        id: "10000",
        key: "PROJ",
        name: "Test Project",
      },
      labels: ["backend", "api"],
      created: "2024-01-15T10:00:00.000Z",
      updated: "2024-01-16T15:30:00.000Z",
    },
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      getIssue: mock(() => Promise.resolve(mockIssue)),
      adfToText: mock((adf) => {
        if (!adf) return "";
        if (typeof adf === "string") return adf;
        return "Test description";
      }),
    } as unknown as JiraClient;
  });

  it("should return formatted issue data", async () => {
    const result = await getIssue(mockClient, { issue_key: "PROJ-123" });
    const parsed = JSON.parse(result);

    expect(parsed.key).toBe("PROJ-123");
    expect(parsed.summary).toBe("Test Issue Summary");
    expect(parsed.description).toBe("Test description");
    expect(parsed.status).toBe("To Do");
    expect(parsed.assignee).toBe("John Doe");
    expect(parsed.reporter).toBe("Jane Smith");
  });

  it("should handle unassigned issues", async () => {
    const unassignedIssue = {
      ...mockIssue,
      fields: { ...mockIssue.fields, assignee: null },
    };
    mockClient.getIssue = mock(() => Promise.resolve(unassignedIssue));

    const result = await getIssue(mockClient, { issue_key: "PROJ-123" });
    const parsed = JSON.parse(result);

    expect(parsed.assignee).toBe("Unassigned");
  });

  it("should pass fields and expand options to client", async () => {
    const getIssueMock = mock(() => Promise.resolve(mockIssue));
    mockClient.getIssue = getIssueMock;

    await getIssue(mockClient, {
      issue_key: "PROJ-123",
      fields: ["summary", "status"],
      expand: ["changelog"],
    });

    expect(getIssueMock).toHaveBeenCalledWith(
      "PROJ-123",
      ["summary", "status"],
      ["changelog"]
    );
  });

  it("should include parent information when present", async () => {
    const issueWithParent = {
      ...mockIssue,
      fields: {
        ...mockIssue.fields,
        parent: {
          key: "PROJ-100",
          fields: { summary: "Parent Epic" },
        },
      },
    };
    mockClient.getIssue = mock(() => Promise.resolve(issueWithParent));

    const result = await getIssue(mockClient, { issue_key: "PROJ-123" });
    const parsed = JSON.parse(result);

    expect(parsed.parent).toEqual({
      key: "PROJ-100",
      summary: "Parent Epic",
    });
  });
});
