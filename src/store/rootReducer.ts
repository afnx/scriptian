import { combineReducers } from "@reduxjs/toolkit";

import browserReducer from "../features/browser/browserSlice";
import scriptsReducer from "../features/scripts/scriptsSlice";
import settingsReducer from "../features/settings/settingsSlice";

export const rootReducer = combineReducers({
  browser: browserReducer,
  scripts: scriptsReducer,
  settings: settingsReducer,
});
