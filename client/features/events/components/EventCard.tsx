"use client"

import { useState } from "react"
import Image from "next/image"
import { Baby, Bookmark, Building2, CalendarDays, MapPin, MoreVertical, PartyPopper, Pencil, Tag, Trash2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { EventDTO } from "../types/event.types"
import { useEventsStore } from "../store/EventStore"
import useToggleSaveEvent from "../hooks/useToggleSaveEvent"
import { toast } from "sonner"
import { useAuthStore } from "@/features/auth/store/authStore"
import Link from "next/link"

function formatEventDate(startDate: string, startTime: string) {
  const date = new Date(startDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

  const day = isSameDay(date, today)
    ? "Heute"
    : isSameDay(date, tomorrow)
      ? "Morgen"
      : date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })

  return `${day}, ${startTime} Uhr`
}

const AGE_RANGE_LABELS: Record<EventDTO["ageRange"], string> = {
  "0-3": "0-3 Jahre",
  "4-6": "4-6 Jahre",
  "7-10": "7-10 Jahre",
  "10-14": "10-14 Jahre",
  parents: "Für Eltern",
  "all-ages": "Alle Alter",
}

function formatAgeRange(ageRange: EventDTO["ageRange"]) {
  return AGE_RANGE_LABELS[ageRange]
}

const STATUS_LABELS: Record<EventDTO["status"], string> = {
  pending: "Ausstehend",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
}

function getCategoryName(categoryId: EventDTO["categoryId"]) {
  return typeof categoryId === "string" ? null : categoryId.name
}

function getOrganizer(createdBy: EventDTO["createdBy"]) {
  if (typeof createdBy === "string") {
    return { username: "Unbekannt", avatarUrl: null as string | null, role: "user" as const }
  }
  return createdBy
}

interface EventCardProps {
  event: EventDTO
  className?: string
  variant?: "public" | "owner"
  onDelete?: () => void
}

const EventCard = ({ event, className, variant = "public", onDelete }: EventCardProps) => {

  const accessToken = useAuthStore((state) => state.accessToken)

  const isSaved = useEventsStore(state => state.savedEventIds.has(event._id))
  const { mutate: toggleSave } = useToggleSaveEvent()

  const categoryName = getCategoryName(event.categoryId)
  const freeSpots = Math.max(event.capacity.max - event.capacity.current, 0)

  const organizer = getOrganizer(event.createdBy)
  const isOrganizer = organizer.role === "organizer"

  const toggleSaved = () => {

    if (!accessToken) {
      toast.error("Bitte melde dich an, um Events zu speichern.")
      return
    }
    toggleSave(event._id)
  }

  const avatar = (
    <Avatar size="sm" className="size-5 shrink-0">
      {organizer.avatarUrl && <AvatarImage src={organizer.avatarUrl} alt={organizer.username} />}
      <AvatarFallback className="text-[10px]">
        {organizer.username.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <Card className={cn("gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md", className)}>
      {/* Bild: nur zwei schwebende Elemente (Kategorie, Merken), diagonal platziert */}
      <div className="relative aspect-2/1 w-full overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="300px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-accent">
            <PartyPopper className="size-6 text-secondary-foreground/40" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex items-center gap-1">
          {categoryName && (
            <Badge className="h-4 gap-1 border-none bg-background/90 px-1.5 text-[10px] font-medium text-foreground shadow-sm">
              <Tag className="size-2.5" />
              {categoryName}
            </Badge>
          )}
          {variant === "owner" && event.status !== "approved" && (
            <Badge className="h-4 border-none bg-background/90 px-1.5 text-[10px] font-medium text-destructive shadow-sm">
              {STATUS_LABELS[event.status]}
            </Badge>
          )}
        </div>

        {variant === "owner" ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Event-Optionen"
                  className="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
                />
              }
            >
              <MoreVertical className="size-3.5 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/profile/events-bearbeiten/${event._id}`} />}>
                <Pencil />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            aria-pressed={isSaved}
            aria-label={isSaved ? "Event gespeichert" : "Event speichern"}
            onClick={toggleSaved}
            className="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
          >
            <Bookmark className={cn("size-3 text-foreground", isSaved && "fill-primary text-primary")} />
          </button>
        )}
      </div>

      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1">
            <CalendarDays className="size-3 shrink-0" />
            <span className="truncate">
              {formatEventDate(event.schedule.startDate, event.schedule.startTime)}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-foreground">
            <Baby className="size-3 shrink-0" />
            {formatAgeRange(event.ageRange)}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-foreground">
          {event.title}
        </h3>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {event.location.venueName ?? event.location.addressLine}, {event.location.city}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Users className="size-3 shrink-0" />
            {freeSpots} frei
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 border-t border-border pt-2">
          {isOrganizer ? (
            <span
              title={organizer.username}
              className="flex min-w-0 items-center gap-1.5 rounded-full bg-secondary/15 py-0.5 pr-2 pl-0.5 text-xs font-medium text-secondary"
            >
              {avatar}
              <Building2 className="size-3 shrink-0" aria-label="Organisation" />
              <span className="truncate">{organizer.username}</span>
            </span>
          ) : (
            <span className="flex min-w-0 items-center gap-1.5">
              {avatar}
              <span className="truncate text-xs text-muted-foreground">
                <span title={organizer.username}>{organizer.username}</span>
                <span className="text-muted-foreground/70"> · Privat</span>
              </span>
            </span>
          )}
          {event.status === "approved" ? (
            <Link href={`/events/${event.slug}`}>
              <Button size="xs" className="shrink-0 rounded-full">
                Details
              </Button>
            </Link>
          ) : (
            <Button
              size="xs"
              disabled
              className="shrink-0 rounded-full"
              title="Details sind erst nach Genehmigung sichtbar."
            >
              Details
            </Button>
          )}

        </div>
      </CardContent>
    </Card>
  )
}

export default EventCard
