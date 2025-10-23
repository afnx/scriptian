import { configureStore } from "@reduxjs/toolkit";
import {
  RenderHookOptions,
  renderHook as rtlRenderHook,
} from "@testing-library/react-native";
import { ReactNode } from "react";
import { Provider } from "react-redux";

import browserReducer from "@/src/features/browser/browserSlice";
import { BrowserState, BrowserTab } from "@/src/features/browser/types";
import scriptsReducer from "@/src/features/scripts/scriptsSlice";
import {
  ScriptExecution,
  ScriptsState,
  UserScript,
} from "@/src/features/scripts/types";
import settingsReducer from "@/src/features/settings/settingsSlice";
import { SettingsState } from "@/src/features/settings/types";
import { RootState } from "@/src/store";

// Default states for each slice
export const defaultBrowserState: BrowserState = {
  tabs: [
    {
      id: "tab-1",
      url: "https://example.com",
      title: "Example",
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      activeScripts: [],
    },
  ],
  activeTabId: "tab-1",
  showTabs: false,
  bookmarks: ["https://bookmark.com"],
};

export const defaultScriptsState: ScriptsState = {
  userScripts: {},
  executions: {},
  isLoading: false,
  error: null,
};

export const defaultSettingsState: SettingsState = {
  scriptsEnabled: true,
  maxExecutionTime: 5000,
  logExecutions: true,
  theme: "light",
  autoUpdateScripts: false,
};

// Store factory function
export const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      browser: browserReducer,
      scripts: scriptsReducer,
      settings: settingsReducer,
    },
    preloadedState: {
      browser: { ...defaultBrowserState, ...preloadedState?.browser },
      scripts: { ...defaultScriptsState, ...preloadedState?.scripts },
      settings: { ...defaultSettingsState, ...preloadedState?.settings },
    },
  });
};

// Wrapper component factory
export const createTestWrapper = (
  store: ReturnType<typeof createMockStore>
) => {
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  TestWrapper.displayName = "TestWrapper";
  return TestWrapper;
};

// Custom render hook with store
export const renderHookWithStore = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: {
    initialState?: Partial<RootState>;
    hookOptions?: RenderHookOptions<TProps>;
  }
) => {
  const store = createMockStore(options?.initialState);
  const wrapper = createTestWrapper(store);

  const result = rtlRenderHook(hook, {
    wrapper,
    ...options?.hookOptions,
  });

  return {
    ...result,
    store, // Return store for assertions
  };
};

// Test data factories
export const createMockTab = (overrides?: Partial<BrowserTab>) => ({
  id: "mock-tab-id",
  url: "https://mock.com",
  title: "Mock Tab",
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
  activeScripts: [],
  ...overrides,
});

export const createMockScript = (overrides?: Partial<UserScript>) => ({
  id: "mock-script-id",
  name: "Mock Script",
  description: "A mock script for testing",
  code: 'console.log("Hello World");',
  urlPatterns: ["*"],
  enabled: true,
  runAt: "document-ready" as const,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  ...overrides,
});

export const createMockExecution = (overrides?: Partial<ScriptExecution>) => ({
  id: "mock-execution-id",
  scriptId: "mock-script-id",
  url: "https://example.com",
  timestamp: "2025-01-01T00:00:00Z",
  success: true,
  ...overrides,
});
