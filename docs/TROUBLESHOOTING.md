# 🔧 Troubleshooting

Common issues and their solutions.

## Authentication Issues

### `INVALID_CLIENT: Invalid redirect URI`
**Cause:** Redirect URI mismatch between code and Spotify Dashboard.
**Fix:**
1. Run `console.log(makeRedirectUri({ scheme: 'spotifyimitation' }))` to see the exact URI
2. Add that exact URI to your Spotify Dashboard → Settings → Redirect URIs
3. Make sure there are no trailing slashes or case differences

### OAuth doesn't work in Expo Go
**Cause:** Custom URI schemes require native code.
**Fix:** Use a Development Build:
```bash
npx expo prebuild
npx expo run:ios  # or run:android
```

### Token refresh fails
**Cause:** Refresh token may be invalid or expired.
**Fix:** Log out and log in again. Check that `refreshAccessToken()` in `auth.ts` is working correctly.

## Build Issues

### `Cannot find module 'expo-audio'`
**Fix:** Run `npx expo install expo-audio` and rebuild.

### Metro bundler errors
**Fix:**
```bash
# Clear Metro cache
npx expo start --clear

# Or reset everything
rm -rf node_modules
npm install
npx expo start --clear
```

### iOS build fails
**Fix:**
```bash
cd ios
pod install
cd ..
npx expo run:ios
```

## API Issues

### Spotify API returns 401
**Cause:** Access token expired.
**Fix:** The app auto-refreshes tokens. If it persists, log out and log in again.

### Spotify API returns 429
**Cause:** Rate limit exceeded.
**Fix:** Wait a moment and try again. The app uses debounced search to prevent this.

### No audio playback
**Cause:** Track may not have a preview URL (Spotify limitation).
**Fix:** Not all tracks have preview URLs. Try a different track.

### Supabase queries return empty
**Cause:** RLS policies may not be set up.
**Fix:** Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to enable RLS and create policies.

## UI Issues

### Mini player overlaps tab bar
**Fix:** The mini player is positioned `bottom: 80` to sit above the tab bar. Adjust in `MiniPlayer.tsx` if your tab bar height differs.

### Dark mode not working
**Fix:** The app uses a fully custom dark theme via `constants/colors.ts`. It does not rely on system dark mode.

## Environment Variables

### Variables not loading
**Fix:**
1. Make sure variables start with `EXPO_PUBLIC_`
2. Restart the dev server after changing `.env`
3. Clear Metro cache: `npx expo start --clear`
