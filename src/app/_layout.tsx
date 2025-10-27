import { ThemeProvider } from "@/src/theme/ThemeContext";
import { useTheme } from "@/src/theme/useTheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "../store";

const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 16, fontSize: 16, color: "#8E8E93" }}>
      Loading Scriptian...
    </Text>
  </View>
);

const ThemedStatusBar = () => {
  const theme = useTheme();
  return <StatusBar style={theme.statusBarStyle} />;
};

const AppContent = () => {
  return (
    <SafeAreaProvider>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <ThemeProvider>
          <KeyboardProvider>
            <AppContent />
          </KeyboardProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
