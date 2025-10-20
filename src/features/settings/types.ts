export interface SettingsState {
  scriptsEnabled: boolean;
  maxExecutionTime: number;
  logExecutions: boolean;
  theme: "light" | "dark" | "system";
  autoUpdateScripts: boolean;
}
