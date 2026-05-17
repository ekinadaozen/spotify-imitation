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

/**
 * Converts any string (like a Spotify user ID) into a valid UUID format.
 * This is required when storing data in Supabase if the column type is uuid.
 */
export function stringToUuid(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const hex3 = Math.abs(hash * 17).toString(16).padStart(8, '0');
  const hex4 = Math.abs(hash * 7).toString(16).padStart(8, '0');
  
  const fullHex = (hex1 + hex2 + hex3 + hex4).padEnd(32, '0');
  
  // UUID format: 8-4-4-4-12
  // We'll set the version to 4 (random) just to make it a valid-looking UUID
  const uuid = `${fullHex.slice(0, 8)}-${fullHex.slice(8, 12)}-4${fullHex.slice(13, 16)}-8${fullHex.slice(17, 20)}-${fullHex.slice(20, 32)}`;
  return uuid;
}
