
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")

    if (!query || !query.trim()) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 })
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=de&q=${encodeURIComponent(query)}`

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Kindora/1.0 (kitzaa.support@gmail.com)",
        },
    })

    if (!response.ok) {
        return NextResponse.json({ error: "Geocoding failed" }, { status: 502 })
    }

    const results = await response.json()

    if (!Array.isArray(results) || results.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { lat, lon } = results[0]

    return NextResponse.json({ lat: Number(lat), lng: Number(lon) })
}
