# 📋 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2026-05-16

### Added

#### Authentication
- Spotify OAuth login with PKCE flow
- Automatic token refresh on expiry
- Session persistence via AsyncStorage
- Auth state hydration on app launch
- Secure logout with token cleanup

#### Home Screen
- Time-based personalized greeting
- Recently played tracks (horizontal scroll)
- New releases from Spotify
- Featured playlists
- User's top tracks
- Pull-to-refresh functionality

#### Search
- Debounced search input (400ms)
- Tabbed results: Songs, Artists, Albums
- Genre category browse cards
- Clear search functionality

#### Music Player
- Mini player with track info and progress bar
- Full-screen player modal with large artwork
- Play/Pause/Next/Previous controls
- Seek bar with position tracking
- Shuffle and Repeat modes (off/queue/track)
- Queue management from any track list
- Animated transitions between mini and full player

#### Library
- Like/unlike songs (stored in Supabase)
- Liked songs list view
- Create custom playlists
- Add/remove tracks from playlists
- Delete playlists

#### User Profile
- Display user avatar and info
- Stats: playlists, liked songs, followers
- Spotify subscription badge
- Settings menu (placeholder)
- Logout functionality

#### UI/UX
- Spotify-inspired dark theme
- Smooth animations with react-native-reanimated
- Haptic feedback on interactions
- Loading/Error/Empty state components
- Responsive mobile design

#### Developer Experience
- TypeScript strict mode
- Zustand for state management
- File-based routing with Expo Router
- Clean project structure
- 15 documentation files
- Environment variable support

### Technical Details
- React Native + Expo SDK 54
- TypeScript 5.9
- Zustand 5
- Supabase JS 2.x
- Expo Router 6
- expo-audio for playback
- react-native-reanimated 4
