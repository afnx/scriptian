export interface UserScript {
  id: string;
  name: string;
  description?: string;
  code: string;
  urlPatterns: string[];
  enabled: boolean;
  runAt: "document-start" | "document-ready" | "document-end";
  createdAt: string;
  updatedAt: string;
}

export interface ScriptExecution {
  id: string;
  scriptId: string;
  url: string;
  timestamp: string;
  success: boolean;
  error?: string;
  executionTime?: number;
}

export interface ScriptsState {
  userScripts: Record<string, UserScript>;
  executions: Record<string, ScriptExecution>;
  isLoading: boolean;
  error: string | null;
}
