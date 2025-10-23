import { useAppSelector } from "@/src/store";
import { createContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { themes } from "./themes";
import { Theme } from "./types/theme";

export const ThemeContext = createContext<Theme>(themes.default);

function getTheme(theme: string): Theme {
  if (theme in themes) {
    return themes[theme];
  }
  return themes.default;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const themeMode = useAppSelector((state) => state.settings.theme);
  const colorScheme = useColorScheme();

  const themeName: string = useMemo(() => {
    if (themeMode === "system") {
      return colorScheme === "light" ? "light" : "dark";
    } else {
      return themeMode;
    }
  }, [themeMode, colorScheme]);

  const value = useMemo(() => getTheme(themeName), [themeName]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
