# 👨‍💻 Development Guide

Best practices, coding standards, and development workflow.

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run type check: `npx tsc --noEmit`
4. Run lint: `npm run lint`
5. Test on device/simulator
6. Commit with conventional commits: `feat: add playlist creation`
7. Push and create a PR

## Coding Standards

### TypeScript
- **Strict mode** is enabled — no `any` types
- Use explicit types for function params and return values
- Prefer `interface` for object shapes, `type` for unions/intersections

### Components
- One component per file
- Use named exports (not default) for components in `src/`
- Default exports only for screen files in `app/`
- Keep components focused — single responsibility

### Naming Conventions
| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TrackItem.tsx` |
| Hooks | camelCase with `use` prefix | `useSpotifyAuth.ts` |
| Stores | camelCase with `use` prefix | `usePlayerStore.ts` |
| Types | PascalCase | `SpotifyTrack` |
| Constants | UPPER_SNAKE_CASE | `SPOTIFY_API` |
| Utils | camelCase | `formatDuration` |

### State Management
- Use Zustand stores for global state
- Use `useState` for local component state
- Use selectors to avoid unnecessary re-renders:
  ```tsx
  // ✅ Good — subscribes only to isPlaying
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  
  // ❌ Bad — subscribes to entire store
  const store = usePlayerStore();
  ```

### Imports
- Group imports: React → Libraries → Internal modules
- Use relative paths for nearby files
- Use `../../src/` prefix from `app/` files

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add playlist creation modal
fix: resolve token refresh race condition
style: update tab bar spacing
docs: add API documentation
refactor: simplify audio player hook
```

## Debugging Tips

- Use React Native DevTools (integrated in Metro)
- Use `console.log` with descriptive prefixes: `[Auth]`, `[Player]`, `[API]`
- Check Supabase dashboard for database queries
- Test OAuth flow on a real device when possible
