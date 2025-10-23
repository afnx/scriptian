import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { type Theme } from "../types/theme";

export const lightTheme: Theme = {
  name: "light",
  statusBarStyle: "dark",
  typography: {
    ...typography,
  },
  spacing: {
    ...spacing,
  },
  colors: {
    ...colors,
  },
};
