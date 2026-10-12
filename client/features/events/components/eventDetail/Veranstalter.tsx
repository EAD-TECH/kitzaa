import { Building2, PartyPopper } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { EventDTO } from "../../types/event.types"

function getOrganizer(createdBy: EventDTO["createdBy"], unknownName: string) {
  if (typeof createdBy === "string") {
    return { username: unknownName, avatarUrl: null as string | null, role: "user" as const }
  }
  return createdBy
}

interface VeranstalterProps {
  createdBy: EventDTO["createdBy"]
  eventCount: number
}

const Veranstalter = async ({ createdBy, eventCount }: VeranstalterProps) => {
  const t = await getTranslations("Events")
  const common = await getTranslations("Common")
  const organizer = getOrganizer(createdBy, common("unknown"))
  const isOrganizer = organizer.role === "organizer"

  return (
    <div className="order-1 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 desktop:order-2">
      <h2 className="font-heading text-base font-semibold text-foreground">
        {t("aboutOrganizer")}
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
            {isOrganizer ? common("organization") : common("private")}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <PartyPopper className="size-3.5 text-secondary" />
          {t("organizedEvents")}
        </span>
        <span className="rounded-full bg-accent/50 px-3 py-1 text-sm leading-none font-bold text-secondary">
          {eventCount}
        </span>
      </div>
    </div>
  )
}

export default Veranstalter
