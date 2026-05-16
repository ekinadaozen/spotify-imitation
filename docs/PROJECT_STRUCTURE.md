# 📁 Project Structure

This document explains the folder structure and the role of each directory/file.

## Top-Level Structure

```
spotify-imitation/
├── app/                  # Expo Router — file-based navigation
├── src/                  # Application source code
├── assets/               # Static assets (images, fonts)
├── docs/                 # Documentation files
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies & scripts
├── .env.example          # Environment variable template
└── .gitignore            # Git ignore rules
```

## `app/` — Screens & Navigation

Expo Router uses file-based routing. Each file becomes a route.

```
app/
├── _layout.tsx           # Root layout (providers, splash, global player)
├── (auth)/               # Auth group (unauthenticated users)
│   ├── _layout.tsx       # Auth stack layout
│   └── login.tsx         # Spotify OAuth login screen
└── (tabs)/               # Main app (authenticated, tab navigation)
    ├── _layout.tsx       # Tab bar configuration
    ├── index.tsx         # Home screen
    ├── search.tsx        # Search screen
    ├── library.tsx       # Library (playlists & liked songs)
    └── profile.tsx       # User profile & settings
```

## `src/` — Application Code

### `src/components/`
Reusable UI components organized by domain:

| Folder | Components | Purpose |
|--------|-----------|---------|
| `ui/` | Button, Card, Input, Avatar, IconButton | Primitive UI elements |
| `common/` | LoadingScreen, ErrorState, EmptyState | Shared state displays |
| `track/` | TrackItem, TrackList | Song display & list |
| `playlist/` | PlaylistCard | Playlist display |
| `artist/` | ArtistCard | Artist display |
| `album/` | AlbumCard | Album display |
| `player/` | MiniPlayer, FullPlayer | Music player UI |

### `src/services/`
API layer — simple fetch wrappers:

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client initialization |
| `spotify.ts` | Spotify Web API calls |
| `auth.ts` | OAuth helpers (login, token exchange, refresh) |

### `src/store/`
Zustand state stores (split by domain):

| File | Manages |
|------|---------|
| `useAuthStore.ts` | User, tokens, authentication state |
| `usePlayerStore.ts` | Playback, queue, position, controls |
| `useLibraryStore.ts` | Liked songs, playlists (via Supabase) |

### `src/hooks/`
Custom React hooks:

| File | Purpose |
|------|---------|
| `useSpotifyAuth.ts` | Spotify OAuth PKCE flow |
| `useAudioPlayer.ts` | Audio playback (wraps expo-audio) |
| `useSpotifyApi.ts` | Authenticated API calls with auto-refresh |

### `src/types/`
TypeScript type definitions:

| File | Types |
|------|-------|
| `spotify.ts` | Spotify API response types |
| `supabase.ts` | Database table types |
| `navigation.ts` | Route parameter types |

### `src/constants/`
App-wide constants:

| File | Contains |
|------|----------|
| `colors.ts` | Dark theme color palette |
| `spacing.ts` | Spacing scale & border radius |
| `typography.ts` | Font sizes & weights |
| `api.ts` | API endpoints & OAuth scopes |

### `src/utils/`
Helper functions:

| File | Functions |
|------|-----------|
| `format.ts` | Duration, number, greeting, text formatters |
| `storage.ts` | AsyncStorage token management |

## Design Principles

1. **Flat structure** — No deeply nested folders
2. **Domain grouping** — Components grouped by feature (track, player, etc.)
3. **Separation of concerns** — Services, stores, and components are independent
4. **Type safety** — Everything is typed via the `types/` folder
5. **Beginner-friendly** — Easy to navigate and understand
