import { Baby, CalendarDays, Clock, Euro } from "lucide-react"

import type { EventDTO } from "../../types/event.types"

const AGE_RANGE_LABELS: Record<EventDTO["ageRange"], string> = {
  "0-3": "0-3 Jahre",
  "4-6": "4-6 Jahre",
  "7-10": "7-10 Jahre",
  "10-14": "10-14 Jahre",
  parents: "Für Eltern",
  "all-ages": "Alle Alter",
}

function formatDate(startDate: string) {
  return new Date(startDate).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatPrice(event: EventDTO) {
  if (event.isFree || !event.price) return "Kostenlos"
  return `${event.price.amount} ${event.price.currency}`
}

interface EventInfoProps {
  event: EventDTO
}

const EventInfo = ({ event }: EventInfoProps) => {
  const items = [
    {
      icon: CalendarDays,
      label: "Datum",
      value: formatDate(event.schedule.startDate),
    },
    {
      icon: Clock,
      label: "Uhrzeit",
      value: `${event.schedule.startTime} - ${event.schedule.endTime}`,
    },
    {
      icon: Baby,
      label: "Alter",
      value: AGE_RANGE_LABELS[event.ageRange],
    },
    {
      icon: Euro,
      label: "Preis",
      value: formatPrice(event),
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
