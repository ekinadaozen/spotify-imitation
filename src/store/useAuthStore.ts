/**
 * Auth store — manages user authentication state
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SpotifyUser } from '../types/spotify';
import { getSpotifyTokens, isTokenExpired } from '../utils/storage';
import { refreshAccessToken, logout as authLogout } from '../services/auth';
import { getMe } from '../services/spotify';

interface AuthState {
  user: SpotifyUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: SpotifyUser) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => set({ accessToken: token }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      logout: async () => {
        await authLogout();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Restore auth state from storage on app launch
       */
      hydrate: async () => {
        try {
          set({ isLoading: true });
          const { accessToken } = await getSpotifyTokens();

          if (!accessToken) {
            set({ isLoading: false });
            return;
          }

          // Check if token is expired and refresh if needed
          const expired = await isTokenExpired();
          let validToken = accessToken;

          if (expired) {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              set({ isLoading: false, isAuthenticated: false });
              return;
            }
            validToken = newToken;
          }

          // Fetch user profile
          const user = await getMe(validToken);
          set({
            user,
            accessToken: validToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false, isAuthenticated: false });
        }
      },

      /**
       * Get a valid (non-expired) access token, refreshing if needed
       */
      getValidToken: async () => {
        const { accessToken } = get();
        if (!accessToken) return null;

        const expired = await isTokenExpired();
        if (!expired) return accessToken;

        const newToken = await refreshAccessToken();
        if (newToken) {
          set({ accessToken: newToken });
        }
        return newToken;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
