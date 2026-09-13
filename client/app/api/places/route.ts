import { NextRequest, NextResponse } from "next/server";
import { searchNominatimPlaces } from "@/lib/geocode/nominatim";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const results = await searchNominatimPlaces(query, 8);

    const places = results.map((place) => ({
      placeName: place.name ?? place.display_name ?? query.trim(),
      city:
        place.address?.city ??
        place.address?.town ??
        place.address?.village ??
        place.address?.municipality ??
        null,
      lat: Number(place.lat),
      lng: Number(place.lon),
    }));

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }
}