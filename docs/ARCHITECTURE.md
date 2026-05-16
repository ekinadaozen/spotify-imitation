# 🏗️ Architecture

Technical architecture and design decisions.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              Screens (app/)             │
│  Login  Home  Search  Library  Profile  │
├─────────────────────────────────────────┤
│            Components (src/)            │
│  UI  Track  Player  Playlist  Common    │
├─────────────────────────────────────────┤
│          Hooks (src/hooks/)             │
│  useSpotifyAuth  useAudioPlayer         │
│  useSpotifyApi                          │
├─────────────────────────────────────────┤
│     State Management (src/store/)       │
│  useAuthStore  usePlayerStore           │
│  useLibraryStore                        │
├─────────────────────────────────────────┤
│        Services (src/services/)         │
│  auth.ts  spotify.ts  supabase.ts       │
├─────────────────────────────────────────┤
│          External Services              │
│  Spotify Web API    Supabase            │
└─────────────────────────────────────────┘
```

## Data Flow

```
User Action → Component → Hook/Store → Service → API
                                  ↓
                           State Update
                                  ↓
                          Component Re-render
```

## State Management Pattern

Uses **Zustand** with domain-split stores:

| Store | Responsibility | Persistence |
|-------|---------------|-------------|
| `useAuthStore` | User, tokens, auth state | AsyncStorage (partial) |
| `usePlayerStore` | Playback, queue, position | In-memory only |
| `useLibraryStore` | Liked songs, playlists | Supabase (server) |

### Why Zustand over Context/Redux?
- **Minimal boilerplate** — No providers, reducers, or actions
- **Performance** — Built-in selector support
- **Simple API** — Easy for beginners
- **Persistence** — Built-in `persist` middleware
- **No over-engineering** — Exactly what we need

## Authentication Flow

```
1. User taps "Login with Spotify"
2. expo-auth-session opens browser with PKCE challenge
3. User authorizes on Spotify
4. Redirect back with authorization code
5. App exchanges code for access/refresh tokens
6. Tokens saved to AsyncStorage
7. User profile fetched from Spotify API
8. Auth store updated → app navigates to (tabs)
```

## Audio Playback Architecture

```
expo-audio (useAudioPlayer hook)
      ↕ syncs with
usePlayerStore (Zustand)
      ↕ drives
MiniPlayer / FullPlayer UI
```

- Track changes trigger new audio loading
- Play/pause state synced bidirectionally
- Position updates via polling (500ms interval)
- Track end triggers next/repeat logic

## Data Storage Strategy

| Data | Storage | Why |
|------|---------|-----|
| Spotify tokens | AsyncStorage | Quick access, no server needed |
| User profile cache | Zustand persist → AsyncStorage | Fast app startup |
| Liked songs | Supabase Postgres | Server-side, survives reinstall |
| Playlists | Supabase Postgres | Server-side, shareable |
| Player state | Zustand (memory) | Transient, no need to persist |
| Browse/search data | Zustand (memory) | Fetched fresh each time |

## Key Design Decisions

1. **No backend server** — Supabase handles everything
2. **PKCE without client secret** — Secure for mobile
3. **Preview URLs only** — Avoids native Spotify SDK complexity
4. **Domain-split stores** — Clean separation of concerns
5. **File-based routing** — Expo Router keeps navigation simple
6. **Flat component structure** — Easy to find and modify
