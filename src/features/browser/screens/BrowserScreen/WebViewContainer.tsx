import { useScripts } from "@/src/features/scripts/hooks/useScripts";
import { useCallback, useRef } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { useBrowser } from "../../hooks/useBrowser";
import { normalizeUrl } from "../../utils/urlUtils";

const SCROLL_DIRECTION_THRESHOLD = 8;

function getInjectionScripts(
  url: string,
  runAt: "document-start" | "document-ready" | "document-end",
  getScriptsByRunAt: any
) {
  return getScriptsByRunAt(url, runAt)
    .map((script: any) => script.code)
    .join("\n");
}

type WebViewContainerProps = {
  bottomPadding?: number;
  onScrollDirectionChange?: (direction: "up" | "down") => void;
} & ViewProps;

export default function WebViewContainer({
  bottomPadding = 0,
  style,
  onScrollDirectionChange,
  ...props
}: WebViewContainerProps) {
  const { activeTab, updateTabById } = useBrowser();
  const { getScriptsByRunAt, logExecution } = useScripts();
  const webviewRef = useRef<WebView>(null);

  // Prepare URL
  const url = activeTab?.url ? normalizeUrl(activeTab.url) : "about:blank";

  // Inject scripts at different lifecycle points
  const injectedJavaScriptBeforeContentLoaded = activeTab?.url
    ? getInjectionScripts(url, "document-start", getScriptsByRunAt)
    : "";
  const injectedJavaScript = activeTab?.url
    ? getInjectionScripts(url, "document-ready", getScriptsByRunAt)
    : "";

  // Handle navigation events
  const onNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      if (!activeTab) return;
      updateTabById(activeTab.id, {
        url: navState.url,
        title: navState.title ?? "",
        canGoBack: navState.canGoBack,
        canGoForward: navState.canGoForward,
        isLoading: navState.loading,
      });
    },
    [activeTab, updateTabById]
  );

  // Handle JS execution results
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    // TODO: Log execution results
  }, []);

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
        ref={webviewRef}
        source={{ uri: url }}
        injectedJavaScriptBeforeContentLoaded={
          injectedJavaScriptBeforeContentLoaded
        }
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
        startInLoadingState={true}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures
        originWhitelist={["*"]}
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
