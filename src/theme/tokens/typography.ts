import { Platform } from "react-native";
import { FontWeight } from "../types/typography";

export const typography = {
  fontFamily: Platform.OS === "ios" ? "San Francisco" : "Roboto",
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  fontWeight: {
    thin: "100" as FontWeight,
    light: "300" as FontWeight,
    regular: "400" as FontWeight,
    medium: "500" as FontWeight,
    bold: "700" as FontWeight,
    black: "900" as FontWeight,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.7,
  },
  letterSpacing: {
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
  h1: {
    fontSize: 32,
    fontWeight: "700" as FontWeight,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as FontWeight,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as FontWeight,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as FontWeight,
  },
  h5: {
    fontSize: 18,
    fontWeight: "500" as FontWeight,
  },
  h6: {
    fontSize: 16,
    fontWeight: "500" as FontWeight,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as FontWeight,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as FontWeight,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as FontWeight,
  },
};
