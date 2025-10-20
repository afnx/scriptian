import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  addUserScript,
  clearExecutionLogs,
  deleteUserScript,
  logScriptExecution,
  setError,
  toggleUserScript,
  updateUserScript,
} from "../scriptsSlice";
import { ScriptExecution, UserScript } from "../types";
import { createPatternRegex } from "../utils";

export const useScripts = () => {
  const dispatch = useAppDispatch();
  const scriptsState = useAppSelector((state) => state.scripts);
  const settings = useAppSelector((state) => state.settings);

  // Script CRUD operations
  const createScript = (scriptData: {
    url?: string;
    code?: string;
    name: string;
    description?: string;
    urlPatterns: string[];
    runAt: "document-start" | "document-ready" | "document-end";
  }) => {
    return dispatch(addUserScript(scriptData));
  };

  const updateScript = (id: string, updates: Partial<UserScript>) => {
    dispatch(updateUserScript(id, updates));
  };

  const removeScript = (id: string) => {
    dispatch(deleteUserScript(id));
  };

  const toggleScript = (id: string) => {
    dispatch(toggleUserScript(id));
  };

  // Execution logging
  const logExecution = useCallback(
    (execution: ScriptExecution) => {
      if (settings.logExecutions) {
        dispatch(logScriptExecution(execution));
      }
    },
    [dispatch, settings.logExecutions]
  );

  const clearLogs = () => {
    dispatch(clearExecutionLogs());
  };

  const clearError = () => {
    dispatch(setError(null));
  };

  const patternRegexCache = useMemo(() => {
    const cache: Record<string, RegExp> = {};
    Object.values(scriptsState.userScripts).forEach((script) => {
      script.urlPatterns.forEach((pattern) => {
        if (!cache[pattern]) {
          try {
            cache[pattern] = createPatternRegex(pattern);
          } catch {
            // Invalid pattern, skip caching
          }
        }
      });
    });
    return cache;
  }, [scriptsState.userScripts]);

  const getScriptsForUrl = useCallback(
    (url: string) => {
      if (!settings.scriptsEnabled) return [];

      return Object.values(scriptsState.userScripts).filter(
        (script) =>
          script.enabled &&
          script.urlPatterns.some((pattern) => {
            const regex = patternRegexCache[pattern];
            return regex?.test(url) ?? false;
          })
      );
    },
    [scriptsState.userScripts, settings.scriptsEnabled, patternRegexCache]
  );

  const getScriptsByRunAt = useCallback(
    (url: string, runAt: UserScript["runAt"]) => {
      return getScriptsForUrl(url).filter((script) => script.runAt === runAt);
    },
    [getScriptsForUrl]
  );

  // Computed values
  const scripts = Object.values(scriptsState.userScripts);
  const enabledScripts = scripts.filter((script) => script.enabled);
  const scriptCount = scripts.length;
  const enabledScriptCount = enabledScripts.length;
  const executionLogs = Object.values(scriptsState.executions);
  const recentExecutions = executionLogs
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 50); // Keep only last 50 executions

  return {
    // State
    userScripts: scriptsState.userScripts,
    executions: scriptsState.executions,
    isLoading: scriptsState.isLoading,
    error: scriptsState.error,

    // Computed values
    scripts,
    enabledScripts,
    scriptCount,
    enabledScriptCount,
    executionLogs,
    recentExecutions,
    scriptsEnabled: settings.scriptsEnabled,

    // Actions
    createScript,
    updateScript,
    removeScript,
    toggleScript,
    logExecution,
    clearLogs,
    clearError,
    getScriptsForUrl,
    getScriptsByRunAt,
  };
};
