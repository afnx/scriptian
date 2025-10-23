import { type TextStyle } from "react-native";

export type FontWeight = TextStyle["fontWeight"];

export type Typography = {
  fontFamily: string;
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    display: number;
  };
  fontWeight: {
    thin: FontWeight;
    light: FontWeight;
    regular: FontWeight;
    medium: FontWeight;
    bold: FontWeight;
    black: FontWeight;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    normal: number;
    wide: number;
    wider: number;
  };
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
  [key: string]: any;
};
