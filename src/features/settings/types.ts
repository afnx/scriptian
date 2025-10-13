export interface SettingsState {
  scriptsEnabled: boolean;
  maxExecutionTime: number;
  logExecutions: boolean;
  theme: "light" | "dark";
  autoUpdateScripts: boolean;
}
