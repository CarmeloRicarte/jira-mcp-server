import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const getIssueSchema = {
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  fields: z
    .array(z.string())
    .optional()
    .describe("Specific fields to retrieve (default: all)"),
  expand: z
    .array(z.string())
    .optional()
    .describe("Fields to expand (e.g., 'changelog', 'renderedFields')"),
};

export type GetIssueInput = z.infer<z.ZodObject<typeof getIssueSchema>>;

export async function getIssue(
  client: JiraClient,
  input: GetIssueInput
): Promise<string> {
  const issue = await client.getIssue(input.issue_key, input.fields, input.expand);

  // Extract and format relevant information
  const result = {
    key: issue.key,
    id: issue.id,
    summary: issue.fields.summary,
    description: client.adfToText(issue.fields.description),
    status: issue.fields.status.name,
    priority: issue.fields.priority?.name,
    issuetype: issue.fields.issuetype.name,
    assignee: issue.fields.assignee?.displayName ?? "Unassigned",
    reporter: issue.fields.reporter?.displayName,
    project: {
      key: issue.fields.project.key,
      name: issue.fields.project.name,
    },
    labels: issue.fields.labels,
    created: issue.fields.created,
    updated: issue.fields.updated,
    parent: issue.fields.parent
      ? {
          key: issue.fields.parent.key,
          summary: issue.fields.parent.fields?.summary,
        }
      : undefined,
  };

  return JSON.stringify(result, null, 2);
}
