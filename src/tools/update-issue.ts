import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const updateIssueSchema = z.object({
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  summary: z.string().optional().describe("New issue title/summary"),
  description: z
    .string()
    .optional()
    .describe("New issue description (plain text)"),
  assignee_id: z
    .string()
    .optional()
    .describe("New assignee account ID (null to unassign)"),
  priority: z
    .string()
    .optional()
    .describe("New priority name (e.g., 'High', 'Medium', 'Low')"),
  labels: z
    .array(z.string())
    .optional()
    .describe("New labels (replaces existing labels)"),
  additional_fields: z
    .record(z.unknown())
    .optional()
    .describe("Additional fields to update (e.g., custom fields)"),
});

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export async function updateIssue(
  client: JiraClient,
  input: UpdateIssueInput,
): Promise<string> {
  await client.updateIssue({
    issue_key: input.issue_key,
    summary: input.summary,
    description: input.description,
    assignee_id: input.assignee_id,
    priority: input.priority,
    labels: input.labels,
    additional_fields: input.additional_fields,
  });

  // Get the updated issue to confirm the changes
  const issue = await client.getIssue(input.issue_key, [
    "summary",
    "description",
    "assignee",
    "priority",
    "labels",
  ]);

  return JSON.stringify(
    {
      key: issue.key,
      summary: issue.fields.summary,
      assignee: issue.fields.assignee?.displayName ?? null,
      priority: issue.fields.priority?.name ?? null,
      labels: issue.fields.labels ?? [],
      message: `Issue ${issue.key} updated successfully`,
    },
    null,
    2,
  );
}
