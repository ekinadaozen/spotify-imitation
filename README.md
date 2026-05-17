#  Spotify Imitation

A clean, beginner-friendly Spotify-inspired music streaming mobile app built with modern technologies.

##  Screenshots

> Screenshots will be added once the app is running.

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native + Expo | Cross-platform mobile framework |
| TypeScript | Type-safe JavaScript |
| Expo Router | File-based navigation |
| Zustand | Lightweight state management |
| Supabase | Backend-as-a-Service (auth, database) |
| Spotify Web API | Music data and streaming |
| expo-audio | Audio playback |
| react-native-reanimated | Smooth animations |

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd spotify-imitation

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase and Spotify credentials

# 4. Start the dev server
npx expo start
```

> **Note:** Spotify OAuth requires a Development Build, not Expo Go.
> Run `npx expo prebuild` and build with EAS or locally.

## 📁 Project Structure

```
app/           → Expo Router screens and layouts
src/
  components/  → Reusable UI components
  services/    → API layer (Spotify, Supabase, Auth)
  store/       → Zustand state stores
  hooks/       → Custom React hooks
  types/       → TypeScript type definitions
  constants/   → Colors, spacing, typography, API config
  utils/       → Helper functions
docs/          → Project documentation
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](docs/SETUP_GUIDE.md) | Step-by-step setup instructions |
| [Architecture](docs/ARCHITECTURE.md) | App architecture overview |
| [Development Guide](docs/DEVELOPMENT_GUIDE.md) | Coding standards & workflow |
| [API Documentation](docs/API_DOCUMENTATION.md) | Spotify API endpoints used |
| [Supabase Setup](docs/SUPABASE_SETUP.md) | Database schema & RLS |
| [Spotify API Setup](docs/SPOTIFY_API_SETUP.md) | OAuth configuration |
| [Features](docs/FEATURES.md) | Feature list & status |
| [UI/UX Guidelines](docs/UI_UX_GUIDELINES.md) | Design system docs |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues & fixes |
| [Deployment](docs/DEPLOYMENT_GUIDE.md) | EAS Build & deployment |
| [Contributing](docs/CONTRIBUTING.md) | Contribution guidelines |
| [Roadmap](docs/ROADMAP.md) | Future plans |
| [Changelog](docs/CHANGELOG.md) | Version history |

## 🔑 Key Features

- ✅ Spotify OAuth login (PKCE flow)
- ✅ Home screen with personalized content
- ✅ Search songs, artists, albums
- ✅ Mini player & full-screen player
- ✅ Like songs (saved to Supabase)
- ✅ Create & manage playlists
- ✅ Recently played
- ✅ User profile
- ✅ Dark modern UI
- ✅ Smooth animations

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with ❤️ using React Native & Expo
