import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { JiraClient } from "../../src/client/jira-client.js";
import { deleteIssue } from "../../src/tools/delete-issue.js";

describe("deleteIssue", () => {
  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      deleteIssue: mock(() => Promise.resolve()),
    } as unknown as JiraClient;
  });

  it("should delete issue and return success message", async () => {
    const result = await deleteIssue(mockClient, {
      issue_key: "PROJ-123",
      delete_subtasks: false,
    });

    expect(result).toBe("Issue PROJ-123 deleted successfully");
    expect(mockClient.deleteIssue).toHaveBeenCalledWith("PROJ-123", false);
  });

  it("should delete issue with subtasks when specified", async () => {
    const result = await deleteIssue(mockClient, {
      issue_key: "PROJ-456",
      delete_subtasks: true,
    });

    expect(result).toBe("Issue PROJ-456 deleted successfully");
    expect(mockClient.deleteIssue).toHaveBeenCalledWith("PROJ-456", true);
  });

  it("should default delete_subtasks to false", async () => {
    const deleteIssueMock = mock(() => Promise.resolve());
    mockClient.deleteIssue = deleteIssueMock;

    await deleteIssue(mockClient, {
      issue_key: "PROJ-789",
    });

    expect(deleteIssueMock).toHaveBeenCalledWith("PROJ-789", false);
  });
});
