import Image from "next/image"
import { ArrowUpRight, MapPin } from "lucide-react"
import { getTranslations } from "next-intl/server"

import type { EventDTO } from "../../types/event.types"

interface StandortProps {
  location: EventDTO["location"]
}

const Standort = async ({ location }: StandortProps) => {
  const t = await getTranslations("Events")
  const [lng, lat] = location.coordinates.coordinates
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <h2 className="font-heading text-lg font-semibold text-foreground">{t("location")}</h2>

      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("openRoute")}
          className="group relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent/40 tablet:w-64"
        >
          <Image
            src="/images/map.png"
            alt={t("mapAlt", { address: `${location.addressLine}, ${location.city}` })}
            fill
            sizes="(min-width: 768px) 256px, 100vw"
            className="scale-110 object-cover transition-transform duration-200 group-hover:scale-125"
          />
          <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            {t("route")}
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
