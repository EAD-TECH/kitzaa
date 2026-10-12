import { Baby, CalendarDays, Clock, Euro } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import type { EventDTO } from "../../types/event.types"
import { formatAgeRanges } from "../../utils/ageRange"

function formatDate(startDate: string, locale: string) {
  return new Date(startDate).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface EventInfoProps {
  event: EventDTO
}

const EventInfo = async ({ event }: EventInfoProps) => {
  const t = await getTranslations("Events")
  const common = await getTranslations("Common")
  const locale = await getLocale()
  const priceLabel = event.isFree || !event.price
    ? common("free")
    : `${event.price.amount} ${event.price.currency}`

  const items = [
    {
      icon: CalendarDays,
      label: t("date"),
      value: formatDate(event.schedule.startDate, locale),
    },
    {
      icon: Clock,
      label: t("time"),
      value: `${event.schedule.startTime} - ${event.schedule.endTime}`,
    },
    {
      icon: Baby,
      label: t("age"),
      value: formatAgeRanges(event.ageRanges, t),
    },
    {
      icon: Euro,
      label: t("price"),
      value: priceLabel,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3 "
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className=" text-sm font-semibold text-foreground">
              {label}
            </span>
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventInfo
