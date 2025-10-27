import IconButton from "@/src/components/IconButton";
import { Icons } from "@/src/constants/Icons";
import { useTheme } from "@/src/theme/useTheme";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useBrowser } from "../../hooks/useBrowser";
import { formatUrlForDisplay } from "../../utils/urlUtils";

interface AddressBarProps {
  onFocusChange?: (isFocused: boolean) => void;
}

export default function AddressBar({ onFocusChange }: AddressBarProps) {
  const theme = useTheme();
  const { activeTab, navigateTab, activeTabId } = useBrowser();

  const [input, setInput] = useState(activeTab?.url ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const showDeleteIcon = isFocused && input.length > 0;

  // Update input field when active tab changes
  useEffect(() => {
    setInput(activeTab?.url ?? "");
  }, [activeTab?.url]);

  const handleSubmitEditing = () => {
    if (!activeTabId) return;
    navigateTab(activeTabId, input);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.gray100,
        },
      ]}
    >
      {!isFocused && (
        <View style={styles.iconLeft}>
          <IconButton
            icon={activeTab?.url ? Icons.readerOutline : Icons.search}
            size={20}
            accessibilityLabel={activeTab?.url ? "Open menu" : "Search"}
          />
        </View>
      )}
      <TextInput
        style={[styles.input, { color: theme.colors.textPrimary }]}
        value={isFocused ? input : formatUrlForDisplay(input)}
        onChangeText={setInput}
        onSubmitEditing={handleSubmitEditing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search or enter website name"
        placeholderTextColor={theme.colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="go"
        clearButtonMode="while-editing"
      />
      <View style={[styles.iconRight]}>
        <IconButton
          icon={activeTab?.url && !isFocused ? Icons.refresh : Icons.microphone}
          color={theme.colors.textSecondary}
          size={26}
          accessibilityLabel={activeTab?.url ? "Reload" : "Start voice search"}
          onPress={() => {
            if (activeTabId && activeTab?.url) {
              navigateTab(activeTabId, activeTab.url);
            }
          }}
        />
        {showDeleteIcon && (
          <IconButton
            icon={Icons.deleteInput}
            color={theme.colors.textSecondary}
            size={22}
            accessibilityLabel="Clear input"
            onPress={() => setInput("")}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 16,
    marginHorizontal: 32,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 6,
    borderRadius: 6,
    backgroundColor: "transparent",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 2,
    flexDirection: "row",
    alignItems: "center",
  },
});
