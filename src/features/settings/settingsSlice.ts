import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState, ThemeMode } from "./types";

const initialState: SettingsState = {
  scriptsEnabled: true,
  maxExecutionTime: 5000,
  logExecutions: true,
  theme: "system",
  autoUpdateScripts: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
    },

    toggleScriptsEnabled: (state) => {
      state.scriptsEnabled = !state.scriptsEnabled;
    },

    setMaxExecutionTime: (state, action: PayloadAction<number>) => {
      state.maxExecutionTime = Math.max(1000, Math.min(30000, action.payload));
    },

    toggleLogExecutions: (state) => {
      state.logExecutions = !state.logExecutions;
    },

    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },

    toggleAutoUpdateScripts: (state) => {
      state.autoUpdateScripts = !state.autoUpdateScripts;
    },

    resetSettings: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateSettings,
  toggleScriptsEnabled,
  setMaxExecutionTime,
  toggleLogExecutions,
  setTheme,
  toggleAutoUpdateScripts,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
