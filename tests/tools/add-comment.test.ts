import { describe, it, expect, mock, beforeEach } from "bun:test";
import { addComment } from "../../src/tools/add-comment.js";
import type { JiraClient } from "../../src/client/jira-client.js";
import type { JiraComment } from "../../src/types/jira.js";

describe("addComment", () => {
  const mockComment: JiraComment = {
    id: "10001",
    author: {
      accountId: "123",
      displayName: "John Doe",
      active: true,
    },
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is a test comment" }],
        },
      ],
    },
    created: "2024-01-15T10:00:00.000Z",
    updated: "2024-01-15T10:00:00.000Z",
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      addComment: mock(() => Promise.resolve(mockComment)),
      adfToText: mock(() => "This is a test comment"),
    } as unknown as JiraClient;
  });

  it("should add comment and return formatted result", async () => {
    const result = await addComment(mockClient, {
      issue_key: "PROJ-123",
      body: "This is a test comment",
    });
    const parsed = JSON.parse(result);

    expect(parsed.id).toBe("10001");
    expect(parsed.author).toBe("John Doe");
    expect(parsed.body).toBe("This is a test comment");
    expect(parsed.created).toBe("2024-01-15T10:00:00.000Z");
  });

  it("should pass comment body to client", async () => {
    const addCommentMock = mock(() => Promise.resolve(mockComment));
    mockClient.addComment = addCommentMock;

    await addComment(mockClient, {
      issue_key: "PROJ-123",
      body: "My comment text",
    });

    expect(addCommentMock).toHaveBeenCalledWith("PROJ-123", "My comment text");
  });
});
