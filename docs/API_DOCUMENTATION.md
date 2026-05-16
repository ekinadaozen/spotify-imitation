# 📡 API Documentation

All Spotify Web API endpoints used in this app.

## Authentication

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/authorize` | GET | Initiate OAuth PKCE flow |
| `/api/token` | POST | Exchange code for tokens / refresh token |

**Base URL:** `https://accounts.spotify.com`

## Spotify Web API Endpoints

**Base URL:** `https://api.spotify.com/v1`

All endpoints require `Authorization: Bearer <access_token>` header.

### User Profile

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/me` | GET | `SpotifyUser` | Profile screen, auth hydration |

### Browse

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/browse/new-releases?limit=N` | GET | `SpotifyNewReleases` | Home screen |
| `/browse/featured-playlists?limit=N` | GET | `SpotifyFeaturedPlaylists` | Home screen |
| `/browse/categories?limit=N` | GET | Categories list | Search screen |

### Search

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/search?q=X&type=Y&limit=N` | GET | `SpotifySearchResult` | Search screen |

**Type values:** `track`, `artist`, `album`, `playlist`

### User Library

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/me/player/recently-played?limit=N` | GET | `SpotifyRecentlyPlayed` | Home screen |
| `/me/top/tracks?time_range=X&limit=N` | GET | Top tracks | Home screen |
| `/me/top/artists?time_range=X&limit=N` | GET | Top artists | Home screen |

**Time range values:** `short_term`, `medium_term`, `long_term`

### Tracks & Albums

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/tracks/:id` | GET | `SpotifyTrack` | Track detail |
| `/albums/:id` | GET | `SpotifyAlbum` | Album detail |
| `/albums/:id/tracks` | GET | Album tracks | Album detail |

### Artists

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/artists/:id` | GET | `SpotifyArtist` | Artist detail |
| `/artists/:id/top-tracks?market=X` | GET | Top tracks | Artist detail |

### Recommendations

| Endpoint | Method | Returns | Used In |
|----------|--------|---------|---------|
| `/recommendations?seed_tracks=X&limit=N` | GET | `SpotifyRecommendations` | Home screen |

## OAuth Scopes Used

| Scope | Purpose |
|-------|---------|
| `user-read-email` | Access user email |
| `user-read-private` | Access user profile |
| `user-read-recently-played` | Recently played tracks |
| `user-top-read` | Top tracks/artists |
| `user-library-read` | Read liked songs |
| `user-library-modify` | Like/unlike songs |
| `playlist-read-private` | Read private playlists |
| `playlist-modify-public` | Create/edit public playlists |
| `playlist-modify-private` | Create/edit private playlists |
| `streaming` | Audio streaming |

## Rate Limits

Spotify API has rate limits. The app handles this by:
- Using debounced search (400ms delay)
- Caching data in Zustand stores
- Using `Promise.allSettled` for parallel requests (graceful degradation)

## Error Handling

All API calls return standardized error objects:
```json
{
  "error": {
    "status": 401,
    "message": "The access token expired"
  }
}
```

The `useSpotifyApi` hook automatically refreshes tokens on 401 responses.
