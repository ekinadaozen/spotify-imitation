# 🚀 Deployment Guide

How to build and deploy the app for production.

## Prerequisites

- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`
- Expo account: `eas login`

## EAS Build Setup

```bash
# Initialize EAS
eas build:configure
```

This creates `eas.json` with build profiles.

## Build Profiles

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Building for Android

```bash
# Development build (for testing)
eas build --platform android --profile development

# Preview build (for internal testing)
eas build --platform android --profile preview

# Production build (for Play Store)
eas build --platform android --profile production
```

## Building for iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

> **Note:** iOS builds require an Apple Developer account ($99/year).

## Environment Variables

For production, set environment variables in EAS:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_key"
eas secret:create --name EXPO_PUBLIC_SPOTIFY_CLIENT_ID --value "your_id"
```

## App Store Submission

### Google Play Store
1. Build with `eas build --platform android --profile production`
2. Download the `.aab` file
3. Upload to Google Play Console
4. Fill in store listing, content rating, etc.

### Apple App Store
1. Build with `eas build --platform ios --profile production`
2. Submit with `eas submit --platform ios`
3. Fill in App Store Connect listing

## OTA Updates

For JavaScript-only updates:
```bash
eas update --branch production --message "Bug fixes"
```

## Checklist Before Deployment

- [ ] All environment variables set for production
- [ ] App icons and splash screen configured
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Tested on real devices (iOS and Android)
- [ ] Spotify redirect URIs updated for production
- [ ] Supabase RLS policies verified
