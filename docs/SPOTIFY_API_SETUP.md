# 🎵 Spotify API Setup

How to configure Spotify Developer credentials for this project.

## 1. Create a Spotify Developer Account

1. Go to [developer.spotify.com](https://developer.spotify.com/)
2. Log in with your Spotify account (or create one)
3. Accept the Developer Terms of Service

## 2. Create an App

1. Go to the [Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in:
   - **App name:** `Spotify Imitation`
   - **App description:** `A music streaming mobile app`
   - **Website:** (optional)
   - **Redirect URI:** `spotifyimitation://`
4. Check the **Web API** checkbox
5. Accept the terms and click **Save**

## 3. Get Your Client ID

1. Open your app in the dashboard
2. Go to **Settings**
3. Copy the **Client ID**
4. Add it to your `.env` file:
   ```
   EXPO_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

> **Important:** You do NOT need the Client Secret for mobile apps using PKCE.

## 4. Configure Redirect URIs

Ensure these redirect URIs are added in your app settings:

| Platform | Redirect URI |
|----------|-------------|
| Development | `spotifyimitation://` |
| iOS | `spotifyimitation://` |
| Android | `spotifyimitation://` |

The redirect URI **must exactly match** what `makeRedirectUri()` generates in the app.

## 5. Required Scopes

This app requests the following OAuth scopes:

| Scope | Why |
|-------|-----|
| `user-read-email` | Display user email on profile |
| `user-read-private` | Access private profile data |
| `user-read-recently-played` | Show recently played tracks |
| `user-top-read` | Show top tracks/artists |
| `user-library-read` | Read user's liked songs |
| `user-library-modify` | Like/unlike songs |
| `playlist-read-private` | Read private playlists |
| `playlist-read-collaborative` | Read collaborative playlists |
| `playlist-modify-public` | Create public playlists |
| `playlist-modify-private` | Create private playlists |
| `streaming` | Stream audio (for premium users) |

## 6. OAuth Flow

This app uses **Authorization Code Flow with PKCE** (recommended for mobile):

```
1. App generates code_verifier + code_challenge
2. User is redirected to Spotify login
3. User authorizes the app
4. Spotify redirects back with an authorization code
5. App exchanges code + code_verifier for access/refresh tokens
6. Tokens are stored securely in AsyncStorage
7. Access token is refreshed automatically when expired
```

## Troubleshooting

- **`INVALID_CLIENT: Invalid redirect URI`** — The redirect URI in your code must exactly match the one in the Spotify Dashboard
- **`INVALID_GRANT`** — The authorization code may have expired; try logging in again
- **Scopes not working** — Make sure all required scopes are listed in your auth request

## Rate Limits

- Spotify API has rate limits (varies by endpoint)
- The app uses debounced search (400ms) to minimize requests
- If you hit rate limits, you'll see HTTP 429 responses
