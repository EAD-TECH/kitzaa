import { Building2, PartyPopper } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { EventDTO } from "../../types/event.types"

function getOrganizer(createdBy: EventDTO["createdBy"]) {
  if (typeof createdBy === "string") {
    return { username: "Unbekannt", avatarUrl: null as string | null, role: "user" as const }
  }
  return createdBy
}

interface VeranstalterProps {
  createdBy: EventDTO["createdBy"]
  eventCount: number
}

const Veranstalter = ({ createdBy, eventCount }: VeranstalterProps) => {
  const organizer = getOrganizer(createdBy)
  const isOrganizer = organizer.role === "organizer"

  return (
    <div className="order-1 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 desktop:order-2">
      <h2 className="font-heading text-base font-semibold text-foreground">
        Über den Veranstalter
      </h2>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="lg" className="shrink-0 ring-2 ring-accent">
          {organizer.avatarUrl && (
            <AvatarImage src={organizer.avatarUrl} alt={organizer.username} />
          )}
          <AvatarFallback>{organizer.username.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
            {organizer.username}
            {isOrganizer && <Building2 className="size-3.5 shrink-0 text-secondary" />}
          </span>
          <span className="text-xs text-muted-foreground">
            {isOrganizer ? "Organisation" : "Privat"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <PartyPopper className="size-3.5 text-secondary" />
          Organisierte Events
        </span>
        <span className="rounded-full bg-accent/50 px-3 py-1 text-sm leading-none font-bold text-secondary">
          {eventCount}
        </span>
      </div>
    </div>
  )
}

export default Veranstalter
