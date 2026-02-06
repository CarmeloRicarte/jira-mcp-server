import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const createIssueSchema = z.object({
  project_key: z.string().describe("Project key (e.g., 'PROJ')"),
  summary: z.string().describe("Issue title/summary"),
  issue_type: z
    .string()
    .describe("Issue type (e.g., 'Story', 'Bug', 'Task', 'Epic')"),
  description: z.string().optional().describe("Issue description (plain text)"),
  assignee_id: z.string().optional().describe("Assignee account ID"),
  priority: z
    .string()
    .optional()
    .describe("Priority name (e.g., 'High', 'Medium', 'Low')"),
  labels: z.array(z.string()).optional().describe("Labels to add to the issue"),
  parent_key: z
    .string()
    .optional()
    .describe("Parent issue key for subtasks or stories under an epic"),
  additional_fields: z
    .record(z.unknown())
    .optional()
    .describe("Additional fields as key-value pairs (e.g., custom fields)"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export async function createIssue(
  client: JiraClient,
  input: CreateIssueInput,
): Promise<string> {
  const result = await client.createIssue({
    project_key: input.project_key,
    summary: input.summary,
    issue_type: input.issue_type,
    description: input.description,
    assignee_id: input.assignee_id,
    priority: input.priority,
    labels: input.labels,
    parent_key: input.parent_key,
    additional_fields: input.additional_fields,
  });

  return JSON.stringify(
    {
      id: result.id,
      key: result.key,
      self: result.self,
      message: `Issue ${result.key} created successfully`,
    },
    null,
    2,
  );
}
