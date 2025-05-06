// utils/google.ts
export function extractPlaceIdFromUrl(url: string): string {
    const match = url.match(/query_place_id=([^&]+)/);
    return match ? match[1] : "";
  }