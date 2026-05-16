/**
 * Utility functions for formatting data
 */

/**
 * Format milliseconds to mm:ss display format
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format a large number with K/M suffix
 * e.g., 1500 → "1.5K", 2000000 → "2M"
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Get a greeting message based on the time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get the best image URL from Spotify's image array
 * Returns the image closest to the desired size
 */
export function getBestImage(
  images: Array<{ url: string; width: number | null; height: number | null }>,
  desiredSize: number = 300
): string | null {
  if (!images || images.length === 0) return null;

  // Sort by how close the width is to desired size
  const sorted = [...images].sort((a, b) => {
    const aDiff = Math.abs((a.width ?? 300) - desiredSize);
    const bDiff = Math.abs((b.width ?? 300) - desiredSize);
    return aDiff - bDiff;
  });

  return sorted[0]?.url ?? null;
}

/**
 * Join artist names with commas
 */
export function formatArtists(
  artists: Array<{ name: string }>
): string {
  return artists.map((a) => a.name).join(', ');
}
