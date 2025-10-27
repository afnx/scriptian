import IconButton from "@/src/components/IconButton";
import { Icons } from "@/src/constants/Icons";
import { useTheme } from "@/src/theme/useTheme";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBrowser } from "../../hooks/useBrowser";

export default function Toolbar() {
  const theme = useTheme();
  const {
    activeTab,
    createNewTab,
    closeTabById,
    toggleTabs,
    toggleBookmark,
    isBookmarked,
  } = useBrowser();

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.container]}>
      <IconButton
        icon={Icons.back}
        color={theme.colors.textPrimary}
        size={26}
        disabled={!activeTab?.canGoBack}
        accessibilityLabel="Back"
        onPress={() => {
          // WebView navigation logic will go here
        }}
      />
      <IconButton
        icon={Icons.forward}
        color={theme.colors.textPrimary}
        size={26}
        disabled={!activeTab?.canGoForward}
        accessibilityLabel="Forward"
        onPress={() => {
          // WebView navigation logic will go here
        }}
      />
      <IconButton
        icon={Icons.share}
        color={theme.colors.textPrimary}
        size={26}
        accessibilityLabel="Share"
        onPress={() => {
          // More actions (settings, share, etc.)
        }}
      />
      <IconButton
        icon={
          isBookmarked(activeTab?.url ?? "")
            ? Icons.bookmarkFilled
            : Icons.bookmark
        }
        color={
          isBookmarked(activeTab?.url ?? "")
            ? theme.colors.secondary
            : theme.colors.textPrimary
        }
        size={26}
        accessibilityLabel="Bookmark"
        onPress={() => {
          if (activeTab?.url) toggleBookmark(activeTab.url);
        }}
      />

      <IconButton
        icon={Icons.tabs}
        color={theme.colors.textPrimary}
        size={26}
        accessibilityLabel="Show Tabs"
        onPress={toggleTabs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
});
