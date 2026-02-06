import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { JiraClient } from "../../src/client/jira-client.js";
import { createIssue } from "../../src/tools/create-issue.js";
import type { JiraCreateIssueResponse } from "../../src/types/jira.js";

describe("createIssue", () => {
  const mockResponse: JiraCreateIssueResponse = {
    id: "10001",
    key: "PROJ-123",
    self: "https://test.atlassian.net/rest/api/3/issue/10001",
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      createIssue: mock(() => Promise.resolve(mockResponse)),
    } as unknown as JiraClient;
  });

  it("should create issue and return formatted result", async () => {
    const result = await createIssue(mockClient, {
      project_key: "PROJ",
      summary: "Test Issue",
      issue_type: "Story",
    });
    const parsed = JSON.parse(result);

    expect(parsed.id).toBe("10001");
    expect(parsed.key).toBe("PROJ-123");
    expect(parsed.self).toBe("https://test.atlassian.net/rest/api/3/issue/10001");
    expect(parsed.message).toBe("Issue PROJ-123 created successfully");
  });

  it("should pass basic fields to client", async () => {
    const createIssueMock = mock(() => Promise.resolve(mockResponse));
    mockClient.createIssue = createIssueMock;

    await createIssue(mockClient, {
      project_key: "PROJ",
      summary: "Test Issue",
      issue_type: "Story",
    });

    expect(createIssueMock).toHaveBeenCalledWith({
      project_key: "PROJ",
      summary: "Test Issue",
      issue_type: "Story",
      description: undefined,
      assignee_id: undefined,
      priority: undefined,
      labels: undefined,
      parent_key: undefined,
      additional_fields: undefined,
    });
  });

  it("should pass all optional fields to client", async () => {
    const createIssueMock = mock(() => Promise.resolve(mockResponse));
    mockClient.createIssue = createIssueMock;

    await createIssue(mockClient, {
      project_key: "PROJ",
      summary: "Epic Issue",
      issue_type: "Epic",
      description: "This is a description",
      assignee_id: "user-123",
      priority: "High",
      labels: ["frontend", "urgent"],
      parent_key: "PROJ-100",
      additional_fields: { customfield_10001: "custom value" },
    });

    expect(createIssueMock).toHaveBeenCalledWith({
      project_key: "PROJ",
      summary: "Epic Issue",
      issue_type: "Epic",
      description: "This is a description",
      assignee_id: "user-123",
      priority: "High",
      labels: ["frontend", "urgent"],
      parent_key: "PROJ-100",
      additional_fields: { customfield_10001: "custom value" },
    });
  });

  it("should create an Epic issue type", async () => {
    const createIssueMock = mock(() => Promise.resolve({ ...mockResponse, key: "PROJ-456" }));
    mockClient.createIssue = createIssueMock;

    const result = await createIssue(mockClient, {
      project_key: "PROJ",
      summary: "[EPIC] New Feature",
      issue_type: "Epic",
    });
    const parsed = JSON.parse(result);

    expect(parsed.key).toBe("PROJ-456");
    expect(createIssueMock.mock.calls[0][0].issue_type).toBe("Epic");
  });

  it("should create issue with parent (subtask/story under epic)", async () => {
    const createIssueMock = mock(() => Promise.resolve(mockResponse));
    mockClient.createIssue = createIssueMock;

    await createIssue(mockClient, {
      project_key: "PROJ",
      summary: "Child Task",
      issue_type: "Story",
      parent_key: "PROJ-100",
    });

    expect(createIssueMock.mock.calls[0][0].parent_key).toBe("PROJ-100");
  });
});
