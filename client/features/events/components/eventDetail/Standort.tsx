import Image from "next/image"
import { ArrowUpRight, MapPin } from "lucide-react"

import type { EventDTO } from "../../types/event.types"

interface StandortProps {
  location: EventDTO["location"]
}

const Standort = ({ location }: StandortProps) => {
  const [lng, lat] = location.coordinates.coordinates
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <h2 className="font-heading text-lg font-semibold text-foreground">Standort</h2>

      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Route auf Google Maps öffnen"
          className="group relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent/40 tablet:w-64"
        >
          <Image
            src="/images/map.png"
            alt={`Karte: ${location.addressLine}, ${location.city}`}
            fill
            sizes="(min-width: 768px) 256px, 100vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            Route
            <ArrowUpRight className="size-3" />
          </span>
        </a>
        <div className="flex flex-col gap-1">
          {location.venueName && (
            <span className="text-sm font-semibold text-foreground">{location.venueName}</span>
          )}
          <span className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {location.addressLine}, {location.zipCode} {location.city}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Standort
