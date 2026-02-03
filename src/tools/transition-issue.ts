import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const getTransitionsSchema = {
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
};

export const transitionIssueSchema = {
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  transition_id: z.string().describe("ID of the transition to perform"),
  comment: z.string().optional().describe("Optional comment to add with the transition"),
};

export type GetTransitionsInput = z.infer<
  z.ZodObject<typeof getTransitionsSchema>
>;
export type TransitionIssueInput = z.infer<
  z.ZodObject<typeof transitionIssueSchema>
>;

export async function getTransitions(
  client: JiraClient,
  input: GetTransitionsInput
): Promise<string> {
  const result = await client.getTransitions(input.issue_key);

  const transitions = result.transitions.map((t) => ({
    id: t.id,
    name: t.name,
    toStatus: t.to.name,
    toStatusCategory: t.to.statusCategory.name,
  }));

  return JSON.stringify(
    {
      issue_key: input.issue_key,
      available_transitions: transitions,
    },
    null,
    2
  );
}

export async function transitionIssue(
  client: JiraClient,
  input: TransitionIssueInput
): Promise<string> {
  await client.transitionIssue(
    input.issue_key,
    input.transition_id,
    input.comment
  );

  // Get the updated issue to confirm the transition
  const issue = await client.getIssue(input.issue_key, ["status"]);

  return JSON.stringify(
    {
      issue_key: input.issue_key,
      new_status: issue.fields.status.name,
      message: `Issue transitioned successfully to '${issue.fields.status.name}'`,
    },
    null,
    2
  );
}
