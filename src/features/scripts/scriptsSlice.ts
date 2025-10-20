import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { importScript } from "./api/scriptApi";
import { ScriptExecution, ScriptsState, UserScript } from "./types";
import { validateUrlPattern } from "./utils/patternUtils";
import { validateScript } from "./utils/scriptValidator";

// Async thunk to add a new user script by importing from a URL or direct input
export const addUserScript = createAsyncThunk<
  UserScript,
  {
    url?: string;
    code?: string;
    name: string;
    description?: string;
    urlPatterns: string[];
    runAt: "document-start" | "document-ready" | "document-end";
  },
  { rejectValue: string }
>("scripts/createUserScript", async (args, { rejectWithValue }) => {
  try {
    // Validate URL patterns
    const urlPatternValidations = args.urlPatterns.map(validateUrlPattern);
    const invalidPatterns = urlPatternValidations.filter(
      (result) => !result.valid
    );
    if (invalidPatterns.length > 0) {
      return rejectWithValue(
        invalidPatterns.map((result) => result.error).join(", ")
      );
    }

    let code: string | undefined;

    if (args.code) {
      code = args.code;
    } else if (args.url) {
      code = await importScript(args.url);
    } else {
      return rejectWithValue("Either 'url' or 'code' must be provided.");
    }

    // Validate the script code before creating the script
    const scriptValidation = validateScript(code);
    if (!scriptValidation.valid) {
      return rejectWithValue(
        scriptValidation.error ?? "Unknown validation error"
      );
    }

    const now = new Date().toISOString();
    return {
      id: nanoid(),
      name: args.name,
      description: args.description,
      runAt: args.runAt,
      code,
      urlPatterns: args.urlPatterns,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const initialState: ScriptsState = {
  userScripts: {},
  executions: {},
  isLoading: false,
  error: null,
};

const scriptsSlice = createSlice({
  name: "scripts",
  initialState,
  reducers: {
    updateUserScript: {
      reducer: (
        state,
        action: PayloadAction<{
          id: string;
          updates: Partial<UserScript>;
          updatedAt: string;
        }>
      ) => {
        const { id, updates, updatedAt } = action.payload;
        const script = state.userScripts[id];
        if (script) {
          Object.assign(script, { ...updates, updatedAt });
        }
      },
      prepare: (id: string, updates: Partial<UserScript>) => {
        return {
          payload: {
            id,
            updates,
            updatedAt: new Date().toISOString(),
          },
        };
      },
    },

    deleteUserScript: (state, action: PayloadAction<string>) => {
      const scriptId = action.payload;
      // Remove the script
      delete state.userScripts[scriptId];
      // Also remove related execution logs
      Object.entries(state.executions).forEach(([id, execution]) => {
        if (execution.scriptId === scriptId) {
          delete state.executions[id];
        }
      });
    },

    toggleUserScript: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; updatedAt: string }>
      ) => {
        const script = state.userScripts[action.payload.id];
        if (script) {
          script.enabled = !script.enabled;
          script.updatedAt = action.payload.updatedAt;
        }
      },
      prepare: (id: string) => ({
        payload: {
          id,
          updatedAt: new Date().toISOString(),
        },
      }),
    },

    logScriptExecution: (state, action: PayloadAction<ScriptExecution>) => {
      state.executions[action.payload.id] = action.payload;
    },

    clearExecutionLogs: (state) => {
      state.executions = {};
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addUserScript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserScript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userScripts[action.payload.id] = action.payload;
      })
      .addCase(addUserScript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Script import failed!";
      });
  },
});

export const {
  updateUserScript,
  deleteUserScript,
  toggleUserScript,
  logScriptExecution,
  clearExecutionLogs,
  setError,
} = scriptsSlice.actions;

export default scriptsSlice.reducer;
