import { z } from "zod";
import type { JiraClient } from "../client/jira-client";

export const getIssueFieldsSchema = {
  issue_key: z.string().describe("Issue key (e.g., 'PROJ-123') or ID"),
  include_custom: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include custom fields in the response"),
};

export type GetIssueFieldsInput = z.infer<
  z.ZodObject<typeof getIssueFieldsSchema>
>;

export async function getIssueFields(
  client: JiraClient,
  input: GetIssueFieldsInput
): Promise<string> {
  // Get field metadata to map IDs to names
  const [issue, fieldsMeta] = await Promise.all([
    client.getIssue(input.issue_key),
    client.getFields(),
  ]);

  // Create a map of field ID to field name
  const fieldNameMap = new Map(
    fieldsMeta.map((f) => [f.id, { name: f.name, custom: f.custom }])
  );

  // Process all fields from the issue
  const processedFields: Record<
    string,
    { name: string; value: unknown; custom: boolean }
  > = {};

  for (const [fieldId, value] of Object.entries(issue.fields)) {
    const fieldInfo = fieldNameMap.get(fieldId);

    // Skip if we're filtering out custom fields
    if (!input.include_custom && fieldInfo?.custom) {
      continue;
    }

    // Skip null/undefined values
    if (value === null || value === undefined) {
      continue;
    }

    const fieldName = fieldInfo?.name ?? fieldId;
    const isCustom = fieldInfo?.custom ?? fieldId.startsWith("customfield_");

    // Process the value based on its type
    let processedValue: unknown = value;

    if (typeof value === "object" && value !== null) {
      // Handle ADF documents (description, custom text fields)
      if ("type" in value && value.type === "doc") {
        processedValue = client.adfToText(value as Parameters<typeof client.adfToText>[0]);
      }
      // Handle user objects
      else if ("displayName" in value) {
        processedValue = (value as { displayName: string }).displayName;
      }
      // Handle objects with 'name' property (status, priority, etc.)
      else if ("name" in value) {
        processedValue = (value as { name: string }).name;
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        processedValue = value.map((item) => {
          if (typeof item === "object" && item !== null && "name" in item) {
            return (item as { name: string }).name;
          }
          return item;
        });
      }
    }

    processedFields[fieldId] = {
      name: fieldName,
      value: processedValue,
      custom: isCustom,
    };
  }

  return JSON.stringify(
    {
      key: issue.key,
      fields: processedFields,
    },
    null,
    2
  );
}
