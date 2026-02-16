import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const deleteIssueSchema = z.object({
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  delete_subtasks: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether to delete subtasks of the issue (default: false)"),
});

export type DeleteIssueInput = z.infer<typeof deleteIssueSchema>;

export async function deleteIssue(
  client: JiraClient,
  input: DeleteIssueInput,
): Promise<string> {
  await client.deleteIssue(input.issue_key, input.delete_subtasks ?? false);
  return `Issue ${input.issue_key} deleted successfully`;
}
