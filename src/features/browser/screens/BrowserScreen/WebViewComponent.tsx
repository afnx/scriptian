import { useRef } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { WebView } from "react-native-webview";
import { useBrowser } from "../../hooks/useBrowser";

type WebViewComponentProps = {
  bottomPadding?: number;
  onScrollDirectionChange?: (direction: "up" | "down") => void;
} & ViewProps;

const SCROLL_DIRECTION_THRESHOLD = 8;

export default function WebViewComponent({
  bottomPadding = 0,
  style,
  onScrollDirectionChange,
  ...props
}: WebViewComponentProps) {
  const { activeTab, updateTabById } = useBrowser();
  const { url } = activeTab || {};
  // Inject CSS to add bottom padding to the body
  const injectedCSS = `
    const style = document.createElement('style');
    style.innerHTML = 'body { padding-bottom: ${bottomPadding}px !important; box-sizing: border-box; }';
    document.head.appendChild(style);
  `;

  const lastScrollY = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null); // pixels
  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset?.y ?? 0;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) > SCROLL_DIRECTION_THRESHOLD) {
      const newDirection = diff > 0 ? "down" : "up";
      if (newDirection !== lastDirection.current) {
        onScrollDirectionChange?.(newDirection);
        lastDirection.current = newDirection;
      }
    }
    lastScrollY.current = currentY;
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <WebView
        source={{ uri: url || "about:blank" }}
        injectedJavaScript={injectedCSS}
        onNavigationStateChange={(navState) => {
          if (activeTab?.id) {
            updateTabById(activeTab!.id, { url: navState.url });
          }
        }}
        onScroll={handleScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
});
