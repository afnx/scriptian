import { BrowserState } from "../features/browser/types";
import { ScriptsState } from "../features/scripts/types";
import { SettingsState } from "../features/settings/types";

export interface RootState {
  browser: BrowserState;
  scripts: ScriptsState;
  settings: SettingsState;
}
