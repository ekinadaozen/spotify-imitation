# 🛠️ Setup Guide

Step-by-step guide to get the project running on your machine.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Expo CLI** (installed automatically via npx)
- **Git** ([download](https://git-scm.com/))
- A **Spotify Developer** account
- A **Supabase** account (free tier works)
- **iOS Simulator** (macOS) or **Android Emulator**

## Step 1: Clone & Install

```bash
git clone <repo-url>
cd spotify-imitation
npm install
```

## Step 2: Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in:
   - App name: `Spotify Imitation`
   - Redirect URI: `spotifyimitation://` (match your app scheme)
4. Copy the **Client ID**
5. See [SPOTIFY_API_SETUP.md](SPOTIFY_API_SETUP.md) for detailed instructions

## Step 3: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. Run the SQL from [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to create tables
3. Copy your **Project URL** and **Anon Key** from Settings > API

## Step 4: Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
```

## Step 5: Development Build

Since we use OAuth with custom URI schemes, **Expo Go won't work**. You need a dev build:

```bash
# Generate native projects
npx expo prebuild

# Build for iOS (macOS only)
npx expo run:ios

# Build for Android
npx expo run:android

# Or use EAS Build (cloud)
npx eas build --profile development --platform android
```

## Step 6: Start Development

```bash
npx expo start --dev-client
```

Scan the QR code with your development build app.

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues.
