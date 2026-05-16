/**
 * Login screen — Spotify OAuth login
 * Premium dark design with gradient background
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { useSpotifyAuth } from '../../src/hooks/useSpotifyAuth';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { FontSize, FontWeight } from '../../src/constants/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, isReady } = useSpotifyAuth();

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', Colors.background]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="musical-notes"
              size={48}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.appName}>Spotify Imitation</Text>
          <Text style={styles.tagline}>
            Your music. Your vibe.{'\n'}Anytime, anywhere.
          </Text>
        </View>

        {/* Features list */}
        <View style={styles.features}>
          {[
            { icon: 'search', text: 'Search millions of songs' },
            { icon: 'heart', text: 'Save your favorites' },
            { icon: 'list', text: 'Create playlists' },
            { icon: 'headset', text: 'Stream music instantly' },
          ].map((feature) => (
            <View key={feature.text} style={styles.featureRow}>
              <Ionicons
                name={feature.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Login button */}
        <View style={styles.loginArea}>
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            title="Login with Spotify"
            onPress={login}
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isReady}
            icon={
              <Ionicons
                name="logo-google"
                size={20}
                color={Colors.background}
              />
            }
          />
          <Text style={styles.disclaimer}>
            By continuing, you agree to Spotify's Terms of Service and
            Privacy Policy.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['3xl'],
    justifyContent: 'space-between',
  },
  logoArea: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    // Glow effect
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  appName: {
    color: Colors.text,
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.extrabold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
  },
  loginArea: {
    marginBottom: Spacing['4xl'],
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 16,
  },
});
