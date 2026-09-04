/**
 * Utility to format any Google Maps input (Share URL, coordinates, place query, or address)
 * into a safe, valid clickable Google Maps URL for navigation.
 */
export function formatGoogleMapsUrl(input?: string, fallbackAddress?: string): string {
  if (!input || !input.trim()) {
    if (fallbackAddress && fallbackAddress.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress.trim())}`;
    }
    return 'https://maps.google.com';
  }

  const trimmed = input.trim();

  // 1. If it already starts with http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // 2. If it starts with maps.app.goo.gl or goo.gl or google.com/maps
  if (/^(maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google|www\.google\.[a-z.]+\/maps)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // 3. If it is latitude, longitude coordinates: e.g. "13.6265, 100.2642" or "13.6265,100.2642"
  const coordMatch = trimmed.match(/^(-?\d+(\.\d+)?)\s*[, ]\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[3];
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  // 4. Otherwise treat as a search query / location name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}
