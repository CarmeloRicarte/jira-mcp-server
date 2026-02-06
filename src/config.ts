import { z } from "zod";

const envSchema = z.object({
  JIRA_HOST: z.string().min(1, "JIRA_HOST is required"),
  JIRA_EMAIL: z.string().email("JIRA_EMAIL must be a valid email"),
  JIRA_API_TOKEN: z.string().min(1, "JIRA_API_TOKEN is required"),
});

function loadConfig() {
  const result = envSchema.safeParse({
    JIRA_HOST: process.env.JIRA_HOST,
    JIRA_EMAIL: process.env.JIRA_EMAIL,
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
  });

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `  - ${String(e.path.join("."))}: ${e.message}`)
      .join("\n");
    console.error(`Configuration error:\n${errors}`);
    process.exit(1);
  }

  return {
    host: result.data.JIRA_HOST,
    email: result.data.JIRA_EMAIL,
    apiToken: result.data.JIRA_API_TOKEN,
  };
}

export type Config = ReturnType<typeof loadConfig>;

export const config = loadConfig();
