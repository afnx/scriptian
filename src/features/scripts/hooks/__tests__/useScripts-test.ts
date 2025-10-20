import { act } from "@testing-library/react-native";
import {
  createMockExecution,
  createMockScript,
  defaultScriptsState,
  defaultSettingsState,
  renderHookWithStore,
} from "../../../../__tests__/utils/testUtils";
import { useScripts } from "../useScripts";

describe("useScripts Hook", () => {
  describe("Initial State", () => {
    it("should return initial scripts state correctly", () => {
      const { result } = renderHookWithStore(() => useScripts());

      expect(result.current.userScripts).toEqual({});
      expect(result.current.executions).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.scripts).toEqual([]);
      expect(result.current.enabledScripts).toEqual([]);
      expect(result.current.scriptCount).toBe(0);
      expect(result.current.enabledScriptCount).toBe(0);
      expect(result.current.executionLogs).toEqual([]);
      expect(result.current.recentExecutions).toEqual([]);
      expect(result.current.scriptsEnabled).toBe(true);
    });

    it("should return computed values correctly with existing scripts", () => {
      const mockScript1 = createMockScript({
        id: "script-1",
        name: "Script 1",
        enabled: true,
      });
      const mockScript2 = createMockScript({
        id: "script-2",
        name: "Script 2",
        enabled: false,
      });
      const mockScript3 = createMockScript({
        id: "script-3",
        name: "Script 3",
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": mockScript1,
              "script-2": mockScript2,
              "script-3": mockScript3,
            },
          },
        },
      });

      expect(result.current.scripts).toHaveLength(3);
      expect(result.current.enabledScripts).toHaveLength(2);
      expect(result.current.scriptCount).toBe(3);
      expect(result.current.enabledScriptCount).toBe(2);
      expect(result.current.enabledScripts.map((s) => s.id)).toEqual([
        "script-1",
        "script-3",
      ]);
    });

    it("should handle scripts disabled in settings", () => {
      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          settings: {
            ...defaultSettingsState,
            scriptsEnabled: false,
          },
        },
      });

      expect(result.current.scriptsEnabled).toBe(false);
    });
  });

  describe("Script CRUD Operations", () => {
    it("should create a new script", async () => {
      const { result, store } = renderHookWithStore(() => useScripts());

      const scriptData = {
        name: "New Script",
        description: "A new test script",
        code: 'console.log("test");',
        urlPatterns: ["https://example.com/*"],
        runAt: "document-ready" as const,
      };

      await act(async () => {
        await result.current.createScript(scriptData);
      });

      const state = store.getState().scripts;
      const scripts = Object.values(state.userScripts);
      expect(scripts).toHaveLength(1);
      expect(scripts[0].name).toBe("New Script");
      expect(scripts[0].description).toBe("A new test script");
      expect(scripts[0].code).toBe('console.log("test");');
      expect(scripts[0].urlPatterns).toEqual(["https://example.com/*"]);
      expect(scripts[0].runAt).toBe("document-ready");
      expect(scripts[0].enabled).toBe(true);
      expect(scripts[0].id).toBeDefined();
      expect(scripts[0].createdAt).toBeDefined();
      expect(scripts[0].updatedAt).toBeDefined();
    });

    it("should update an existing script", () => {
      const mockScript = createMockScript({
        id: "script-1",
        name: "Original Name",
        description: "Original Description",
      });

      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": mockScript,
            },
          },
        },
      });

      act(() => {
        result.current.updateScript("script-1", {
          name: "Updated Name",
          description: "Updated Description",
        });
      });

      const state = store.getState().scripts;
      const updatedScript = state.userScripts["script-1"];
      expect(updatedScript.name).toBe("Updated Name");
      expect(updatedScript.description).toBe("Updated Description");
      expect(updatedScript.updatedAt).not.toBe(mockScript.updatedAt);
    });

    it("should remove a script", () => {
      const mockScript = createMockScript({
        id: "script-1",
        name: "Script to Delete",
      });

      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": mockScript,
            },
          },
        },
      });

      act(() => {
        result.current.removeScript("script-1");
      });

      const state = store.getState().scripts;
      expect(state.userScripts["script-1"]).toBeUndefined();
      expect(Object.keys(state.userScripts)).toHaveLength(0);
    });

    it("should toggle script enabled state", () => {
      const mockScript = createMockScript({
        id: "script-1",
        enabled: true,
      });

      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": mockScript,
            },
          },
        },
      });

      act(() => {
        result.current.toggleScript("script-1");
      });

      const state = store.getState().scripts;
      expect(state.userScripts["script-1"].enabled).toBe(false);

      act(() => {
        result.current.toggleScript("script-1");
      });

      const finalState = store.getState().scripts;
      expect(finalState.userScripts["script-1"].enabled).toBe(true);
    });
  });

  describe("Execution Logging", () => {
    it("should log execution when logging is enabled", () => {
      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          settings: {
            ...defaultSettingsState,
            logExecutions: true,
          },
        },
      });

      const execution = createMockExecution({
        id: "exec-1",
        scriptId: "script-1",
        url: "https://example.com",
        success: true,
      });

      act(() => {
        result.current.logExecution(execution);
      });

      const state = store.getState().scripts;
      expect(state.executions["exec-1"]).toEqual(execution);
    });

    it("should not log execution when logging is disabled", () => {
      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          settings: {
            ...defaultSettingsState,
            logExecutions: false,
          },
        },
      });

      const execution = createMockExecution({
        id: "exec-1",
        scriptId: "script-1",
        url: "https://example.com",
        success: true,
      });

      act(() => {
        result.current.logExecution(execution);
      });

      const state = store.getState().scripts;
      expect(state.executions["exec-1"]).toBeUndefined();
    });

    it("should clear execution logs", () => {
      const mockExecution = createMockExecution({
        id: "exec-1",
        scriptId: "script-1",
      });

      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            executions: {
              "exec-1": mockExecution,
            },
          },
        },
      });

      act(() => {
        result.current.clearLogs();
      });

      const state = store.getState().scripts;
      expect(state.executions).toEqual({});
    });

    it("should clear error state", () => {
      const { result, store } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            error: "Some error occurred",
          },
        },
      });

      act(() => {
        result.current.clearError();
      });

      const state = store.getState().scripts;
      expect(state.error).toBeNull();
    });

    it("should return recent executions sorted by timestamp", () => {
      const execution1 = createMockExecution({
        id: "exec-1",
        timestamp: "2025-01-01T10:00:00Z",
      });
      const execution2 = createMockExecution({
        id: "exec-2",
        timestamp: "2025-01-01T12:00:00Z",
      });
      const execution3 = createMockExecution({
        id: "exec-3",
        timestamp: "2025-01-01T11:00:00Z",
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            executions: {
              "exec-1": execution1,
              "exec-2": execution2,
              "exec-3": execution3,
            },
          },
        },
      });

      expect(result.current.recentExecutions).toHaveLength(3);
      expect(result.current.recentExecutions[0].id).toBe("exec-2"); // Most recent
      expect(result.current.recentExecutions[1].id).toBe("exec-3"); // Middle
      expect(result.current.recentExecutions[2].id).toBe("exec-1"); // Oldest
    });
  });

  describe("URL Pattern Matching", () => {
    it("should return scripts for matching URL patterns", () => {
      const script1 = createMockScript({
        id: "script-1",
        urlPatterns: ["https://example.com/*"],
        enabled: true,
      });
      const script2 = createMockScript({
        id: "script-2",
        urlPatterns: ["https://google.com/*"],
        enabled: true,
      });
      const script3 = createMockScript({
        id: "script-3",
        urlPatterns: ["*"],
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script1,
              "script-2": script2,
              "script-3": script3,
            },
          },
        },
      });

      const matchingScripts = result.current.getScriptsForUrl(
        "https://example.com/page"
      );
      expect(matchingScripts).toHaveLength(2);
      expect(matchingScripts.map((s) => s.id)).toEqual(
        expect.arrayContaining(["script-1", "script-3"])
      );
    });

    it("should return empty array when scripts are disabled", () => {
      const script = createMockScript({
        id: "script-1",
        urlPatterns: ["*"],
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script,
            },
          },
          settings: {
            ...defaultSettingsState,
            scriptsEnabled: false,
          },
        },
      });

      const matchingScripts = result.current.getScriptsForUrl(
        "https://example.com"
      );
      expect(matchingScripts).toHaveLength(0);
    });

    it("should not return disabled scripts", () => {
      const script1 = createMockScript({
        id: "script-1",
        urlPatterns: ["*"],
        enabled: true,
      });
      const script2 = createMockScript({
        id: "script-2",
        urlPatterns: ["*"],
        enabled: false,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script1,
              "script-2": script2,
            },
          },
        },
      });

      const matchingScripts = result.current.getScriptsForUrl(
        "https://example.com"
      );
      expect(matchingScripts).toHaveLength(1);
      expect(matchingScripts[0].id).toBe("script-1");
    });

    it("should filter scripts by runAt timing", () => {
      const script1 = createMockScript({
        id: "script-1",
        urlPatterns: ["*"],
        runAt: "document-start",
        enabled: true,
      });
      const script2 = createMockScript({
        id: "script-2",
        urlPatterns: ["*"],
        runAt: "document-ready",
        enabled: true,
      });
      const script3 = createMockScript({
        id: "script-3",
        urlPatterns: ["*"],
        runAt: "document-start",
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script1,
              "script-2": script2,
              "script-3": script3,
            },
          },
        },
      });

      const startScripts = result.current.getScriptsByRunAt(
        "https://example.com",
        "document-start"
      );
      const readyScripts = result.current.getScriptsByRunAt(
        "https://example.com",
        "document-ready"
      );

      expect(startScripts).toHaveLength(2);
      expect(startScripts.map((s) => s.id)).toEqual(
        expect.arrayContaining(["script-1", "script-3"])
      );
      expect(readyScripts).toHaveLength(1);
      expect(readyScripts[0].id).toBe("script-2");
    });

    it("should handle invalid URL patterns gracefully", () => {
      const script = createMockScript({
        id: "script-1",
        urlPatterns: ["[invalid-regex"],
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script,
            },
          },
        },
      });

      // Should not throw an error and should return empty array
      const matchingScripts = result.current.getScriptsForUrl(
        "https://example.com"
      );
      expect(matchingScripts).toHaveLength(0);
    });
  });

  describe("Function Stability", () => {
    it("should maintain function reference stability for memoized functions", () => {
      const { result, rerender } = renderHookWithStore(() => useScripts());

      const firstRender = {
        logExecution: result.current.logExecution,
        getScriptsForUrl: result.current.getScriptsForUrl,
        getScriptsByRunAt: result.current.getScriptsByRunAt,
      };

      rerender({});

      const secondRender = {
        logExecution: result.current.logExecution,
        getScriptsForUrl: result.current.getScriptsForUrl,
        getScriptsByRunAt: result.current.getScriptsByRunAt,
      };

      // These functions should maintain reference stability due to useCallback
      expect(firstRender.logExecution).toBe(secondRender.logExecution);
      expect(firstRender.getScriptsForUrl).toBe(secondRender.getScriptsForUrl);
      expect(firstRender.getScriptsByRunAt).toBe(
        secondRender.getScriptsByRunAt
      );
    });

    it("should create new function references for non-memoized functions", () => {
      const { result, rerender } = renderHookWithStore(() => useScripts());

      const firstRender = {
        createScript: result.current.createScript,
        updateScript: result.current.updateScript,
        removeScript: result.current.removeScript,
        toggleScript: result.current.toggleScript,
        clearLogs: result.current.clearLogs,
        clearError: result.current.clearError,
      };

      rerender({});

      const secondRender = {
        createScript: result.current.createScript,
        updateScript: result.current.updateScript,
        removeScript: result.current.removeScript,
        toggleScript: result.current.toggleScript,
        clearLogs: result.current.clearLogs,
        clearError: result.current.clearError,
      };

      // These functions are not memoized, so they should be different references
      expect(firstRender.createScript).not.toBe(secondRender.createScript);
      expect(firstRender.updateScript).not.toBe(secondRender.updateScript);
      expect(firstRender.removeScript).not.toBe(secondRender.removeScript);
      expect(firstRender.toggleScript).not.toBe(secondRender.toggleScript);
      expect(firstRender.clearLogs).not.toBe(secondRender.clearLogs);
      expect(firstRender.clearError).not.toBe(secondRender.clearError);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty scripts state", () => {
      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {},
            executions: {},
          },
        },
      });

      expect(result.current.scripts).toHaveLength(0);
      expect(result.current.enabledScripts).toHaveLength(0);
      expect(result.current.scriptCount).toBe(0);
      expect(result.current.enabledScriptCount).toBe(0);
      expect(result.current.executionLogs).toHaveLength(0);
      expect(result.current.recentExecutions).toHaveLength(0);
    });

    it("should limit recent executions to 50 items", () => {
      // Create 60 mock executions
      const executions = Array.from({ length: 60 }, (_, i) => {
        const id = `exec-${i + 1}`;
        return [
          id,
          createMockExecution({
            id,
            timestamp: new Date(2025, 0, 1, 0, i).toISOString(),
          }),
        ];
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            executions: Object.fromEntries(executions),
          },
        },
      });

      expect(result.current.executionLogs).toHaveLength(60);
      expect(result.current.recentExecutions).toHaveLength(50);
      // Should include the most recent executions
      expect(result.current.recentExecutions[0].id).toBe("exec-60");
      expect(result.current.recentExecutions[49].id).toBe("exec-11");
    });

    it("should handle scripts with empty URL patterns", () => {
      const script = createMockScript({
        id: "script-1",
        urlPatterns: [],
        enabled: true,
      });

      const { result } = renderHookWithStore(() => useScripts(), {
        initialState: {
          scripts: {
            ...defaultScriptsState,
            userScripts: {
              "script-1": script,
            },
          },
        },
      });

      const matchingScripts = result.current.getScriptsForUrl(
        "https://example.com"
      );
      expect(matchingScripts).toHaveLength(0);
    });

    it("should match URL patterns for dynamically created scripts", async () => {
      const { result } = renderHookWithStore(() => useScripts());

      // Create first script with a pattern
      await act(async () => {
        await result.current.createScript({
          name: "Script 1",
          code: 'console.log("test1");',
          urlPatterns: ["https://example.com/*"],
          runAt: "document-ready",
        });
      });

      // Get scripts for URL (this should create cache entry)
      const firstCall = result.current.getScriptsForUrl(
        "https://example.com/page"
      );
      expect(firstCall).toHaveLength(1);

      // Create second script with SAME pattern
      await act(async () => {
        await result.current.createScript({
          name: "Script 2",
          code: 'console.log("test2");',
          urlPatterns: ["https://example.com/*"], // Same pattern
          runAt: "document-ready",
        });
      });

      // Get scripts again - should reuse cached regex
      const secondCall = result.current.getScriptsForUrl(
        "https://example.com/page"
      );
      expect(secondCall).toHaveLength(2);

      // Create script with NEW pattern
      await act(async () => {
        await result.current.createScript({
          name: "Script 3",
          code: 'console.log("test3");',
          urlPatterns: ["https://google.com/*"], // Different pattern
          runAt: "document-ready",
        });
      });

      // Verify both patterns work
      const exampleScripts = result.current.getScriptsForUrl(
        "https://example.com/page"
      );
      const googleScripts = result.current.getScriptsForUrl(
        "https://google.com/search"
      );

      expect(exampleScripts).toHaveLength(2);
      expect(googleScripts).toHaveLength(1);
    });
  });
});
