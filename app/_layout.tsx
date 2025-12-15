import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import NotificationSetup from "../components/NotificationSetup";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

function AuthNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!session && !inAuthGroup) {
      // Not signed in, redirect to login
      router.replace('/login' as any);
    } else if (session && inAuthGroup) {
      // Signed in, redirect to tabs
      router.replace('/(tabs)' as any);
    }
  }, [session, loading, segments]);

  return null;
}

function RootLayoutContent() {
  const { theme } = useTheme();
  const { loading } = useAuth();

  useEffect(() => {
    // Hide splash screen after auth is checked
    async function hideSplash() {
      if (!loading) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [loading]);

  return (
    <>
      <StatusBar style="light" />
      <NotificationSetup />
      <AuthNavigator />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0D0D0D' },
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

