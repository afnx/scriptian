import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { useTheme } from "@/src/theme/useTheme";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const theme = useTheme();
  const settings = useSettings();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        style={{
          ...theme.typography.h4,
          color: theme.colors.warning,
        }}
      >
        The current theme color is {theme.name}.{"\n"}
        The current theme mode is {settings.theme}.
      </Text>
      <Pressable onPress={() => settings.switchTheme("system")}>
        <Text
          style={{
            ...theme.typography.button,
            color: theme.colors.textPrimary,
          }}
        >
          System Theme
        </Text>
      </Pressable>
      <Pressable onPress={() => settings.switchTheme("light")}>
        <Text
          style={{
            ...theme.typography.button,
            color: theme.colors.textPrimary,
          }}
        >
          Light Theme
        </Text>
      </Pressable>
      <Pressable onPress={() => settings.switchTheme("dark")}>
        <Text
          style={{
            ...theme.typography.button,
            color: theme.colors.textPrimary,
          }}
        >
          Dark Theme
        </Text>
      </Pressable>
    </View>
  );
}
