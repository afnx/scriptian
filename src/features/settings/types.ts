export type ThemeMode = "light" | "dark" | "system";

export interface SettingsState {
  scriptsEnabled: boolean;
  maxExecutionTime: number;
  logExecutions: boolean;
  theme: ThemeMode;
  autoUpdateScripts: boolean;
}
