"use client"

import { useState } from "react"
import Image from "next/image"
import { CalendarDays, PartyPopper, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import type { EventDTO, EventStatus } from "../types/event.types"
import { DeleteEventDialog } from "./DeleteEventDialog"

const STATUS_LABELS: Record<EventStatus, string> = {
  pending: "Ausstehend",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  cancelled: "Abgesagt",
  completed: "Abgeschlossen",
}

const STATUS_BADGE_VARIANT: Record<EventStatus, "secondary" | "default" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  cancelled: "destructive",
  completed: "secondary",
}

// Bearbeiten/Absagen stösst die Statusregeln von eventController.update/deletee
// (nicht erlaubt bei bereits abgesagt/abgeschlossen) — die Buttons werden hier
// ausgeblendet statt einen 400 zu riskieren.
const MANAGEABLE_STATUSES: EventStatus[] = ["pending", "approved"]

function formatEventDate(startDate: string, startTime: string) {
  const date = new Date(startDate)
  return `${date.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}, ${startTime} Uhr`
}

interface MyEventCardProps {
  event: EventDTO
}

export function MyEventCard({ event }: MyEventCardProps) {
  const isManageable = MANAGEABLE_STATUSES.includes(event.status)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CardContent className="flex items-center gap-4 p-3">
        <div className="relative aspect-square size-16 shrink-0 overflow-hidden rounded-xl">
          {event.coverImage ? (
            <Image src={event.coverImage} alt={event.title} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-accent">
              <PartyPopper className="size-5 text-secondary-foreground/40" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{event.title}</h3>
            <Badge variant={STATUS_BADGE_VARIANT[event.status]}>{STATUS_LABELS[event.status]}</Badge>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3 shrink-0" />
            {formatEventDate(event.schedule.startDate, event.schedule.startTime)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {event.status === "approved" && (
            <Link href={`/events/${event.slug}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
          )}
          {isManageable && (
            <Link href={`/profile/events-bearbeiten/${event._id}`}>
              <Button size="sm">
                <Pencil className="size-3.5" />
                Bearbeiten
              </Button>
            </Link>
          )}
          {isManageable && (
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-3.5" />
              Löschen
            </Button>
          )}
        </div>
      </CardContent>

      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        eventId={event._id}
        eventTitle={event.title}
      />
    </Card>
  )
}
