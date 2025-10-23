import { useAppDispatch, useAppSelector } from "../../../store";
import {
  resetSettings,
  setMaxExecutionTime,
  setTheme,
  toggleAutoUpdateScripts,
  toggleLogExecutions,
  toggleScriptsEnabled,
  updateSettings,
} from "../settingsSlice";
import { SettingsState, ThemeMode } from "../types";

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  // General settings update
  const updateAppSettings = (updates: Partial<SettingsState>) => {
    dispatch(updateSettings(updates));
  };

  // Script-related settings
  const toggleScripts = () => {
    dispatch(toggleScriptsEnabled());
  };

  const updateMaxExecutionTime = (time: number) => {
    dispatch(setMaxExecutionTime(time));
  };

  const toggleExecutionLogging = () => {
    dispatch(toggleLogExecutions());
  };

  const toggleAutoUpdate = () => {
    dispatch(toggleAutoUpdateScripts());
  };

  /**
   * Switches the application's theme to the specified mode.
   *
   * @param theme - The desired theme mode to apply (e.g., 'system', 'light', 'dark').
   */
  const switchTheme = (theme: ThemeMode) => {
    dispatch(setTheme(theme));
  };

  // Reset functionality
  const resetAllSettings = () => {
    dispatch(resetSettings());
  };

  // Validation helpers
  const isValidExecutionTime = (time: number) => {
    return time >= 1000 && time <= 30000;
  };

  const getExecutionTimeDisplay = (time: number) => {
    return `${(time / 1000).toFixed(1)}s`;
  };

  // Computed values
  const executionTimeInSeconds = settings.maxExecutionTime / 1000;

  return {
    // Current settings state
    ...settings,

    // Computed values
    executionTimeInSeconds,

    // Actions
    updateSettings: updateAppSettings,
    toggleScripts,
    updateMaxExecutionTime,
    toggleExecutionLogging,
    toggleAutoUpdate,
    switchTheme,
    resetAllSettings,

    // Helpers
    isValidExecutionTime,
    getExecutionTimeDisplay,
  };
};
