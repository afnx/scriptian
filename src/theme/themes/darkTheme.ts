import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { type Theme } from "../types/theme";

export const darkTheme: Theme = {
  name: "dark",
  statusBarStyle: "light",
  typography: {
    ...typography,
  },
  spacing: {
    ...spacing,
  },
  colors: {
    ...colors,
    // Brand colors
    primary: "#0A84FF",
    primaryDark: "#409CFF",
    secondary: "#FF9F0A",
    secondaryDark: "#FF9F0A",

    // Semantic colors
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",

    // Neutral palette
    white: "#1C1C1E",
    gray100: "#000000",
    gray200: "#3A3A3C",
    gray300: "#38383A",
    gray400: "#48484A",
    gray500: "#8E8E93",
    gray600: "#48484A",
    gray700: "#2C2C2E",
    gray800: "rgba(255, 255, 255, 0.05)",
    gray900: "rgba(0, 0, 0, 0.3)",

    // Text colors
    textPrimary: "#FFFFFF",
    textSecondary: "#8E8E93",
    textInverse: "#1C1C1E",

    // Backgrounds
    background: "#000000",
    backgroundAlt: "#1C1C1E",
    backgroundInverse: "#FFFFFF",

    // Borders
    border: "#48484A",
    borderStrong: "#38383A",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.3)",
  },
};
