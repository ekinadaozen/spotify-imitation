/**
 * Spotify-inspired dark color palette
 * All colors are designed for a premium dark mode experience
 */
export const Colors = {
  // Primary brand color (Spotify green)
  primary: '#1DB954',
  primaryLight: '#1ED760',
  primaryDark: '#1AA34A',

  // Backgrounds
  background: '#121212',
  surface: '#181818',
  surfaceLight: '#282828',
  surfaceHighlight: '#333333',

  // Text
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#727272',
  textDisabled: '#535353',

  // Borders & Dividers
  border: '#282828',
  divider: '#333333',

  // Semantic colors
  error: '#F15E6C',
  warning: '#FFA42B',
  success: '#1DB954',
  info: '#509BF5',

  // Gradients
  gradientStart: '#1DB954',
  gradientEnd: '#191414',

  // Player
  playerBackground: '#181818',
  progressBar: '#1DB954',
  progressBarBackground: '#535353',

  // Tab bar
  tabBarBackground: '#121212',
  tabBarBorder: '#282828',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#727272',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
} as const;

export type ColorName = keyof typeof Colors;
