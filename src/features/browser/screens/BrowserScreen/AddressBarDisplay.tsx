import { useTheme } from "@/src/theme/useTheme";
import { StyleSheet, Text, View } from "react-native";
import { useBrowser } from "../../hooks/useBrowser";
import { formatUrlForDisplay } from "../../utils/urlUtils";
export default function AddressBarDisplay() {
  const theme = useTheme();
  const { activeTab } = useBrowser();
  const { url } = activeTab || {};

  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, { fontSize: theme.typography.caption.fontSize }]}
      >
        {formatUrlForDisplay(url || "about:blank")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    paddingTop: 2,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#909090",
  },
  text: {
    color: "#2c3e50",
  },
});
