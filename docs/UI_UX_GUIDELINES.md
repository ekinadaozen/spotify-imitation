# 🎨 UI/UX Guidelines

Design system and component patterns used in the app.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Green) | `#1DB954` | Buttons, active states, progress bar |
| Background | `#121212` | Main background |
| Surface | `#181818` | Cards, player, elevated surfaces |
| Surface Light | `#282828` | Input backgrounds, hover states |
| Text | `#FFFFFF` | Primary text |
| Text Secondary | `#B3B3B3` | Subtitles, metadata |
| Text Muted | `#727272` | Timestamps, inactive tabs |
| Error | `#F15E6C` | Error messages |

## Typography

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Heading 1 | 32px | ExtraBold | Page titles |
| Heading 2 | 24px | Bold | Section titles |
| Heading 3 | 20px | Bold | Card titles |
| Body | 16px | Regular | Body text |
| Body Small | 14px | Regular | Secondary text |
| Caption | 12px | Medium | Metadata, timestamps |
| Micro | 10px | Regular | Badges |

## Spacing Scale

Based on a 4px grid:
- `xs`: 4px — tight gaps
- `sm`: 8px — element padding
- `md`: 12px — standard gap
- `lg`: 16px — section padding
- `xl`: 20px — generous spacing
- `2xl`: 24px — section margins
- `3xl`: 32px — page padding

## Component Patterns

### Cards
- Rounded corners (8px for square, full radius for circular)
- Image + title + subtitle
- Hover feedback via `activeOpacity={0.7}`

### Buttons
- **Primary:** Green background, dark text, full rounded
- **Secondary:** Transparent with border
- **Ghost:** No background, just text

### Track Items
- Horizontal layout: image → info → actions → duration
- Active track highlighted in green
- Like button with heart icon
- Haptic feedback on interaction

### Player
- **Mini:** Fixed bottom bar with progress, album art, play/pause
- **Full:** Modal with large artwork, seek bar, full controls

## Animation Guidelines

- Use `react-native-reanimated` for performant animations
- Entry animations: `FadeInDown` (300ms)
- Exit animations: `FadeOutDown` (200ms)
- Keep animations subtle and purposeful
- Haptic feedback on button presses

## Responsive Design

- Design for mobile-first (iPhone SE to iPhone Pro Max)
- Use percentage-based widths for grids
- Artwork sizes adapt to screen width
- Bottom spacing accounts for mini player + tab bar (120px)

## Accessibility

- Touch targets minimum 44x44px
- Text contrast ratios meet WCAG AA
- Meaningful icon labels via `accessibilityLabel`
- Support for Dynamic Type (planned)
