import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { JiraClient } from "../../src/client/jira-client.js";
import { updateIssue } from "../../src/tools/update-issue.js";
import type { JiraIssue } from "../../src/types/jira.js";

describe("updateIssue", () => {
  const mockUpdatedIssue: JiraIssue = {
    id: "10001",
    key: "PROJ-123",
    self: "https://test.atlassian.net/rest/api/3/issue/10001",
    fields: {
      summary: "Updated Summary",
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
      issuetype: { id: "10001", name: "Story", subtask: false },
      project: { id: "10000", key: "PROJ", name: "Test" },
      created: "2024-01-15T10:00:00.000Z",
      updated: "2024-01-16T15:30:00.000Z",
      assignee: {
        accountId: "user-123",
        displayName: "John Doe",
        active: true,
      },
      priority: { id: "2", name: "High" },
      labels: ["frontend", "urgent"],
    },
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      updateIssue: mock(() => Promise.resolve()),
      getIssue: mock(() => Promise.resolve(mockUpdatedIssue)),
    } as unknown as JiraClient;
  });

  it("should update issue and return formatted result", async () => {
    const result = await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      summary: "Updated Summary",
    });
    const parsed = JSON.parse(result);

    expect(parsed.key).toBe("PROJ-123");
    expect(parsed.summary).toBe("Updated Summary");
    expect(parsed.assignee).toBe("John Doe");
    expect(parsed.priority).toBe("High");
    expect(parsed.labels).toEqual(["frontend", "urgent"]);
    expect(parsed.message).toBe("Issue PROJ-123 updated successfully");
  });

  it("should pass update fields to client", async () => {
    const updateIssueMock = mock(() => Promise.resolve());
    mockClient.updateIssue = updateIssueMock;

    await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      summary: "New Summary",
      description: "New description",
      priority: "High",
    });

    expect(updateIssueMock).toHaveBeenCalledWith({
      issue_key: "PROJ-123",
      summary: "New Summary",
      description: "New description",
      assignee_id: undefined,
      priority: "High",
      labels: undefined,
      additional_fields: undefined,
    });
  });

  it("should fetch updated issue after update", async () => {
    const getIssueMock = mock(() => Promise.resolve(mockUpdatedIssue));
    mockClient.getIssue = getIssueMock;

    await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      summary: "Updated",
    });

    expect(getIssueMock).toHaveBeenCalledWith("PROJ-123", [
      "summary",
      "description",
      "assignee",
      "priority",
      "labels",
    ]);
  });

  it("should handle null assignee", async () => {
    const issueWithoutAssignee = {
      ...mockUpdatedIssue,
      fields: { ...mockUpdatedIssue.fields, assignee: null },
    };
    mockClient.getIssue = mock(() => Promise.resolve(issueWithoutAssignee));

    const result = await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      summary: "Updated",
    });
    const parsed = JSON.parse(result);

    expect(parsed.assignee).toBeNull();
  });

  it("should handle null priority", async () => {
    const issueWithoutPriority = {
      ...mockUpdatedIssue,
      fields: { ...mockUpdatedIssue.fields, priority: undefined },
    };
    mockClient.getIssue = mock(() => Promise.resolve(issueWithoutPriority));

    const result = await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      summary: "Updated",
    });
    const parsed = JSON.parse(result);

    expect(parsed.priority).toBeNull();
  });

  it("should update with additional_fields (custom fields)", async () => {
    const updateIssueMock = mock(() => Promise.resolve());
    mockClient.updateIssue = updateIssueMock;

    await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      additional_fields: {
        customfield_10363: "Work item description",
        customfield_10359: { value: "FRONT" },
      },
    });

    expect(updateIssueMock.mock.calls[0][0].additional_fields).toEqual({
      customfield_10363: "Work item description",
      customfield_10359: { value: "FRONT" },
    });
  });

  it("should update labels array", async () => {
    const updateIssueMock = mock(() => Promise.resolve());
    mockClient.updateIssue = updateIssueMock;

    await updateIssue(mockClient, {
      issue_key: "PROJ-123",
      labels: ["bug", "critical"],
    });

    expect(updateIssueMock.mock.calls[0][0].labels).toEqual(["bug", "critical"]);
  });
});
