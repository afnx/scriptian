import { useTheme } from "@/src/theme/useTheme";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  KeyboardEvents,
  useKeyboardAnimation,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBrowser } from "../../hooks/useBrowser";
import AddressBar from "./AddressBar";
import AddressBarDisplay from "./AddressBarDisplay";
import Toolbar from "./Toolbar";
import WebViewContainer from "./WebViewContainer";

const KEYBOARD_OPENED_HEIGHT = 102;
const KEYBOARD_CLOSED_HEIGHT = 0;

export default function BrowserScreen() {
  const theme = useTheme();
  const { showTabs } = useBrowser();
  const { height, progress } = useKeyboardAnimation();

  const [isAddressBarFocused, setAddressBarFocused] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  const showAddressBar = !isKeyboardVisible || isAddressBarFocused;
  const showBottomContainer = scrollDirection !== "down";

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      setKeyboardVisible(true);
    });

    const hide = KeyboardEvents.addListener("keyboardWillHide", (e) => {
      setKeyboardVisible(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const onAddressBarFocusChange = useCallback((isFocused: boolean) => {
    setAddressBarFocused(isFocused);
    setKeyboardVisible(false);
  }, []);

  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [KEYBOARD_CLOSED_HEIGHT, KEYBOARD_OPENED_HEIGHT],
  });

  const bottomContainerY = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(bottomContainerY, {
      toValue: showBottomContainer ? 0 : 200,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [showBottomContainer, bottomContainerY]);

  const bottomContainerStyle = useMemo(
    () => [
      {
        transform: [
          {
            translateY: Animated.add(height, offset),
          },
          {
            translateY: bottomContainerY,
          },
        ],
      },
      { backgroundColor: "white" },
    ],
    [height, offset, bottomContainerY]
  );

  // Navigation handlers for WebView
  const webviewRef = useRef<any>(null);

  const goBack = () => webviewRef.current?.goBack?.();
  const goForward = () => webviewRef.current?.goForward?.();
  const reload = () => webviewRef.current?.reload?.();
  const stopLoading = () => webviewRef.current?.stopLoading?.();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[
          styles.topContainer,
          { backgroundColor: theme.colors.background },
        ]}
        edges={["top"]}
      >
        <View style={styles.webViewContainer}>
          <WebViewContainer
            ref={webviewRef}
            goBack={goBack}
            goForward={goForward}
            reload={reload}
            stopLoading={stopLoading}
            bottomPadding={isKeyboardVisible ? 16 : 0}
            onScrollDirectionChange={setScrollDirection}
          />
        </View>
      </SafeAreaView>

      <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
        {showAddressBar && (
          <AddressBar
            onReload={reload}
            onStop={stopLoading}
            onFocusChange={onAddressBarFocusChange}
          />
        )}
        {!showAddressBar && <AddressBarDisplay />}
        {/* Toolbar contains the SafeAreaView */}
        <Toolbar onBack={goBack} onForward={goForward} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
