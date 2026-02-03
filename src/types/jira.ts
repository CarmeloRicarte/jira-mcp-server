/**
 * Jira API Type Definitions
 * Based on Jira Cloud REST API v3
 */

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: Record<string, string>;
  active: boolean;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  subtask: boolean;
}

export interface JiraStatus {
  id: string;
  name: string;
  description?: string;
  statusCategory: {
    id: number;
    key: string;
    name: string;
    colorName: string;
  };
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey?: string;
}

export interface JiraComment {
  id: string;
  author: JiraUser;
  body: string | JiraAdfDocument;
  created: string;
  updated: string;
}

export interface JiraAdfDocument {
  type: "doc";
  version: 1;
  content: JiraAdfNode[];
}

export interface JiraAdfNode {
  type: string;
  content?: JiraAdfNode[];
  text?: string;
  marks?: { type: string }[];
}

export interface JiraIssueFields {
  summary: string;
  description?: string | JiraAdfDocument | null;
  issuetype: JiraIssueType;
  status: JiraStatus;
  priority?: JiraPriority;
  assignee?: JiraUser | null;
  reporter?: JiraUser;
  project: JiraProject;
  created: string;
  updated: string;
  labels?: string[];
  components?: { id: string; name: string }[];
  fixVersions?: { id: string; name: string }[];
  parent?: { key: string; fields?: { summary: string } };
  subtasks?: JiraIssue[];
  comment?: { comments: JiraComment[]; total: number };
  [key: string]: unknown; // Custom fields
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraIssueFields;
}

export interface JiraSearchResult {
  expand?: string;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
  nextPageToken?: string;
}

export interface JiraTransition {
  id: string;
  name: string;
  to: JiraStatus;
  hasScreen: boolean;
  isGlobal: boolean;
  isInitial: boolean;
  isConditional: boolean;
}

export interface JiraTransitionsResponse {
  expand?: string;
  transitions: JiraTransition[];
}

export interface JiraConfig {
  host: string;
  email: string;
  apiToken: string;
}

export interface JiraClientOptions {
  config: JiraConfig;
}
