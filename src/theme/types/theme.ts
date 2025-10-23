import { ColorPalette } from "./colorPalette";
import { Spacing } from "./spacing";
import { Typography } from "./typography";

export type Theme = {
  name: string;
  statusBarStyle: "light" | "dark" | "auto";
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
};
