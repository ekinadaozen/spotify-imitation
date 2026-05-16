# 🗄️ Supabase Setup

How to set up the Supabase backend for this project.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Fill in:
   - **Name:** `spotify-imitation`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
4. Wait for the project to initialize

## 2. Get Your Credentials

Go to **Settings** → **API** and copy:
- **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
- **anon (public) key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 3. Create Database Tables

Go to **SQL Editor** and run this SQL:

```sql
-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  spotify_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liked songs
CREATE TABLE liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_name TEXT NOT NULL,
  album_image_url TEXT,
  preview_url TEXT,
  duration_ms INTEGER NOT NULL,
  liked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, spotify_track_id)
);

-- User playlists
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlist tracks (junction table)
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_image_url TEXT,
  preview_url TEXT,
  duration_ms INTEGER NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(playlist_id, spotify_track_id)
);

-- Indexes for performance
CREATE INDEX idx_liked_songs_user ON liked_songs(user_id);
CREATE INDEX idx_playlists_user ON playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
```

## 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Liked songs: users can manage their own likes
CREATE POLICY "Users can view own likes"
  ON liked_songs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes"
  ON liked_songs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON liked_songs FOR DELETE USING (auth.uid() = user_id);

-- Playlists: users can manage their own playlists
CREATE POLICY "Users can view own playlists"
  ON playlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlists"
  ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
  ON playlists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
  ON playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist tracks: users can manage tracks in their own playlists
CREATE POLICY "Users can view own playlist tracks"
  ON playlist_tracks FOR SELECT
  USING (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own playlists"
  ON playlist_tracks FOR INSERT
  WITH CHECK (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete from own playlists"
  ON playlist_tracks FOR DELETE
  USING (playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid()));
```

## 5. Database Schema Diagram

```
profiles
  ├── id (PK, FK → auth.users)
  ├── spotify_id
  ├── display_name
  ├── email
  ├── avatar_url
  └── created_at

liked_songs
  ├── id (PK)
  ├── user_id (FK → profiles)
  ├── spotify_track_id
  ├── track_name
  ├── artist_name
  ├── album_name
  ├── album_image_url
  ├── preview_url
  ├── duration_ms
  └── liked_at

playlists
  ├── id (PK)
  ├── user_id (FK → profiles)
  ├── name
  ├── description
  ├── cover_image_url
  └── created_at

playlist_tracks
  ├── id (PK)
  ├── playlist_id (FK → playlists)
  ├── spotify_track_id
  ├── track_name
  ├── artist_name
  ├── album_image_url
  ├── preview_url
  ├── duration_ms
  ├── added_at
  └── position
```

## Best Practices

- **Always use RLS** — The anon key is exposed in the app
- **Use indexes** for frequently queried columns
- **Unique constraints** prevent duplicate likes/tracks
- **Cascade deletes** keep data clean when users/playlists are deleted
