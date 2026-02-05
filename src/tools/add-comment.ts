import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const addCommentSchema = z.object({
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  body: z
    .string()
    .describe("Comment text (plain text, will be converted to ADF)"),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;

export async function addComment(
  client: JiraClient,
  input: AddCommentInput,
): Promise<string> {
  const comment = await client.addComment(input.issue_key, input.body);

  return JSON.stringify(
    {
      id: comment.id,
      author: comment.author.displayName,
      created: comment.created,
      body: client.adfToText(comment.body),
    },
    null,
    2,
  );
}
