import { createMockStore } from "@/__tests__/utils/testUtils";
import type { ThemeMode } from "@/src/features/settings/types";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { Provider } from "react-redux";
import { ThemeProvider } from "../ThemeContext";
import { themes } from "../themes";
import { useTheme } from "../useTheme";

const renderWithStore = (
  ui: React.ReactElement,
  { theme = "light" }: { theme?: ThemeMode } = {}
) => {
  const store = createMockStore({
    settings: {
      theme,
      scriptsEnabled: true,
      maxExecutionTime: 10000,
      logExecutions: false,
      autoUpdateScripts: false,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

const ThemeNameConsumer = () => {
  const theme = useTheme();
  return <Text>{theme.name}</Text>;
};

describe("ThemeProvider", () => {
  it("provides the light theme when settings.theme is 'light'", () => {
    const { getByText } = renderWithStore(
      <ThemeProvider>
        <ThemeNameConsumer />
      </ThemeProvider>,
      { theme: "light" }
    );
    expect(getByText(themes.light.name)).toBeTruthy();
  });

  it("provides the dark theme when settings.theme is 'dark'", () => {
    const { getByText } = renderWithStore(
      <ThemeProvider>
        <ThemeNameConsumer />
      </ThemeProvider>,
      { theme: "dark" }
    );
    expect(getByText(themes.dark.name)).toBeTruthy();
  });
});
