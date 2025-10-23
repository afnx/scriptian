import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

import type { Theme } from "../types/theme";

export const themes: Record<string, Theme> = {
  default: lightTheme,
  light: lightTheme,
  dark: darkTheme,
};
