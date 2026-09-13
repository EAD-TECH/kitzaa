export type NominatimPlace = {
  lat: string;
  lon: string;
  name?: string;
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
};

export async function searchNominatimPlaces(
  query: string,
  limit = 1,
): Promise<NominatimPlace[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "de");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("q", query.trim());

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Kindora/1.0 (kitzaa.support@gmail.com)",
    },
  });

  if (!response.ok) {
    throw new Error("Geocoding failed");
  }

  const results = await response.json();

  return Array.isArray(results) ? results : [];
}