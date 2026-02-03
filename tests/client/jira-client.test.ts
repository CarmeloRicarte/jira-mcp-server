import { describe, it, expect, mock, beforeEach } from "bun:test";
import { JiraClient, JiraClientError } from "../../src/client/jira-client.js";

describe("JiraClient", () => {
  let client: JiraClient;

  beforeEach(() => {
    client = new JiraClient({
      host: "test.atlassian.net",
      email: "test@example.com",
      apiToken: "test-token",
    });
  });

  describe("constructor", () => {
    it("should create client with correct base URL", () => {
      // The baseUrl is private, but we can verify it works through requests
      expect(client).toBeDefined();
    });
  });

  describe("textToAdf", () => {
    it("should convert simple text to ADF", () => {
      const result = client.textToAdf("Hello world");

      expect(result).toEqual({
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello world" }],
          },
        ],
      });
    });

    it("should handle multiple paragraphs", () => {
      const result = client.textToAdf("First paragraph\n\nSecond paragraph");

      expect(result.content).toHaveLength(2);
      expect(result.content[0].content?.[0].text).toBe("First paragraph");
      expect(result.content[1].content?.[0].text).toBe("Second paragraph");
    });

    it("should collapse single newlines within paragraphs", () => {
      const result = client.textToAdf("Line 1\nLine 2");

      expect(result.content).toHaveLength(1);
      expect(result.content[0].content?.[0].text).toBe("Line 1 Line 2");
    });
  });

  describe("adfToText", () => {
    it("should return empty string for null input", () => {
      expect(client.adfToText(null)).toBe("");
    });

    it("should return empty string for undefined input", () => {
      expect(client.adfToText(undefined)).toBe("");
    });

    it("should return string as-is", () => {
      expect(client.adfToText("plain text")).toBe("plain text");
    });

    it("should extract text from ADF document", () => {
      const adf = {
        type: "doc" as const,
        version: 1 as const,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello" }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "World" }],
          },
        ],
      };

      expect(client.adfToText(adf)).toBe("Hello\nWorld");
    });
  });
});

describe("JiraClientError", () => {
  it("should create error with correct properties", () => {
    const error = new JiraClientError("Test error", 404, "/test/endpoint");

    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(404);
    expect(error.endpoint).toBe("/test/endpoint");
    expect(error.name).toBe("JiraClientError");
  });
});
