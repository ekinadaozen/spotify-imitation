/**
 * Root layout — app entry point
 * Sets up providers, loads fonts, handles auth routing, and renders global player
 */
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/store/useAuthStore';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { MiniPlayer } from '../src/components/player/MiniPlayer';
import { FullPlayer } from '../src/components/player/FullPlayer';
import { LoadingScreen } from '../src/components/common/LoadingScreen';
import { Colors } from '../src/constants/colors';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();

  // Initialize audio player (connects to player store)
  useAudioPlayer();

  // Hydrate auth state on app launch
  useEffect(() => {
    hydrate().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [hydrate]);

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>

      {/* Global player components (only when authenticated) */}
      {isAuthenticated && (
        <>
          <MiniPlayer />
          <FullPlayer />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
