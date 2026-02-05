import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { JiraClient } from "../../src/client/jira-client.js";
import {
  getTransitions,
  transitionIssue,
} from "../../src/tools/transition-issue.js";
import type {
  JiraIssue,
  JiraTransitionsResponse,
} from "../../src/types/jira.js";

describe("getTransitions", () => {
  const mockTransitions: JiraTransitionsResponse = {
    transitions: [
      {
        id: "11",
        name: "Start Progress",
        to: {
          id: "3",
          name: "In Progress",
          statusCategory: {
            id: 4,
            key: "indeterminate",
            name: "In Progress",
            colorName: "yellow",
          },
        },
        hasScreen: false,
        isGlobal: false,
        isInitial: false,
        isConditional: false,
      },
      {
        id: "21",
        name: "Done",
        to: {
          id: "5",
          name: "Done",
          statusCategory: {
            id: 3,
            key: "done",
            name: "Done",
            colorName: "green",
          },
        },
        hasScreen: false,
        isGlobal: true,
        isInitial: false,
        isConditional: false,
      },
    ],
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      getTransitions: mock(() => Promise.resolve(mockTransitions)),
    } as unknown as JiraClient;
  });

  it("should return formatted transitions", async () => {
    const result = await getTransitions(mockClient, { issue_key: "PROJ-123" });
    const parsed = JSON.parse(result);

    expect(parsed.issue_key).toBe("PROJ-123");
    expect(parsed.available_transitions).toHaveLength(2);
    expect(parsed.available_transitions[0]).toEqual({
      id: "11",
      name: "Start Progress",
      toStatus: "In Progress",
      toStatusCategory: "In Progress",
    });
  });
});

describe("transitionIssue", () => {
  const mockUpdatedIssue: JiraIssue = {
    id: "10001",
    key: "PROJ-123",
    self: "https://test.atlassian.net/rest/api/3/issue/10001",
    fields: {
      summary: "Test Issue",
      description: null,
      status: {
        id: "3",
        name: "In Progress",
        statusCategory: {
          id: 4,
          key: "indeterminate",
          name: "In Progress",
          colorName: "yellow",
        },
      },
      issuetype: { id: "10001", name: "Story", subtask: false },
      project: { id: "10000", key: "PROJ", name: "Test" },
      created: "2024-01-15T10:00:00.000Z",
      updated: "2024-01-16T15:30:00.000Z",
    },
  };

  let mockClient: JiraClient;

  beforeEach(() => {
    mockClient = {
      transitionIssue: mock(() => Promise.resolve()),
      getIssue: mock(() => Promise.resolve(mockUpdatedIssue)),
    } as unknown as JiraClient;
  });

  it("should transition issue and return new status", async () => {
    const result = await transitionIssue(mockClient, {
      issue_key: "PROJ-123",
      transition_id: "11",
    });
    const parsed = JSON.parse(result);

    expect(parsed.issue_key).toBe("PROJ-123");
    expect(parsed.new_status).toBe("In Progress");
    expect(parsed.message).toContain("In Progress");
  });

  it("should pass transition with comment", async () => {
    const transitionMock = mock(() => Promise.resolve());
    mockClient.transitionIssue = transitionMock;

    await transitionIssue(mockClient, {
      issue_key: "PROJ-123",
      transition_id: "11",
      comment: "Starting work on this",
    });

    expect(transitionMock).toHaveBeenCalledWith(
      "PROJ-123",
      "11",
      "Starting work on this",
    );
  });

  it("should fetch updated issue after transition", async () => {
    const getIssueMock = mock(() => Promise.resolve(mockUpdatedIssue));
    mockClient.getIssue = getIssueMock;

    await transitionIssue(mockClient, {
      issue_key: "PROJ-123",
      transition_id: "11",
    });

    expect(getIssueMock).toHaveBeenCalledWith("PROJ-123", ["status"]);
  });
});
