import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { requestNotificationPermissions } from "../utils/notifications";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { theme } = useTheme();

  useEffect(() => {
    // Initialize app
    async function initialize() {
      // Request notification permissions
      await requestNotificationPermissions();

      // Hide splash screen
      await SplashScreen.hideAsync();
    }

    initialize();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0D0D0D' },
          animation: 'fade',
          animationDuration: 200,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
