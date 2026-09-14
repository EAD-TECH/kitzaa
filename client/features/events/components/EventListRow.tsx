"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Baby, Bookmark, Building2, Clock, MapPin, PartyPopper, Tag, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EventDTO } from "../types/event.types"
import { useEventsStore } from "../store/EventStore"
import useToggleSaveEvent from "../hooks/useToggleSaveEvent"
import { toast } from "sonner"
import { useAuthStore } from "@/features/auth/store/authStore"

function getDateParts(startDate: string) {
  const date = new Date(startDate)
  return {
    day: date.toLocaleDateString("de-DE", { day: "2-digit" }),
    month: date.toLocaleDateString("de-DE", { month: "short" }),
  }
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

function getCategoryName(categoryId: EventDTO["categoryId"]) {
  return typeof categoryId === "string" ? null : categoryId.name
}

function getOrganizer(createdBy: EventDTO["createdBy"]) {
  if (typeof createdBy === "string") {
    return { username: "Unbekannt", avatarUrl: null as string | null, role: "user" as const }
  }
  return createdBy
}

interface EventListRowProps {
  event: EventDTO
}

const EventListRow = ({ event }: EventListRowProps) => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isSaved = useEventsStore((state) => state.savedEventIds.has(event._id))
  const { mutate: toggleSave } = useToggleSaveEvent()
  const [imgError, setImgError] = useState(false)

  const { day, month } = getDateParts(event.schedule.startDate)
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
    <Avatar size="sm" className="size-7 shrink-0 ring-2 ring-card">
      {organizer.avatarUrl && <AvatarImage src={organizer.avatarUrl} alt={organizer.username} />}
      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-[11px] font-semibold text-primary-foreground">
        {organizer.username.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )

  // Badges (Kategorie + Alter) und Merken-Button: identisch für mobile & tablet/desktop
  const infoRow = (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {categoryName && (
          <Badge className="h-5 gap-1 border-none bg-accent px-2 text-[10px] font-medium text-accent-foreground">
            <Tag className="size-2.5" />
            {categoryName}
          </Badge>
        )}
        <Badge className="h-5 gap-1 border-none bg-accent px-2 text-[10px] font-medium text-accent-foreground">
          <Baby className="size-2.5" />
          {formatAgeRange(event.ageRange)}
        </Badge>
      </div>

      <button
        type="button"
        aria-pressed={isSaved}
        aria-label={isSaved ? "Event gespeichert" : "Event speichern"}
        onClick={toggleSaved}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent transition-colors hover:bg-accent/70"
      >
        <Bookmark className={cn("size-3.5 text-foreground", isSaved && "fill-primary text-primary")} />
      </button>
    </div>
  )

  // Organizer/Private + freie Plätze + Details-Button: identisch für mobile & tablet/desktop
  const footerRow = (
    <div className="flex items-center justify-between gap-2">
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

      <div className="flex shrink-0 items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="size-3 shrink-0" />
          {freeSpots} frei
        </span>
        {event.status === "approved" ? (
          <Link href={`/events/${event.slug}`}>
            <Button size="sm" className="rounded-full cursor-pointer hover:bg-primary/90">
              Details
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            disabled
            className="rounded-full"
            title="Details sind erst nach Genehmigung sichtbar."
          >
            Details
          </Button>
        )}
      </div>
    </div>
  )

  const coverImage = event.coverImage && !imgError ? (
    <Image
      src={event.coverImage}
      alt={event.title}
      fill
      sizes="(min-width: 64rem) 176px, (min-width: 40rem) 144px, 100vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setImgError(true)}
    />
  ) : (
    <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-accent">
      <PartyPopper className="size-5 text-secondary-foreground/40" />
    </div>
  )

  return (
    <>
      {/* Mobil: gestapelte Karte (Bild oben, Inhalt darunter) */}
      <div className="group flex flex-col gap-3 border-t border-border py-6 tablet:hidden">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          {coverImage}
        </div>

        {infoRow}

        <div>
          <h3 className="line-clamp-2 font-heading text-lg leading-tight font-semibold text-foreground">
            {event.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3 shrink-0" />
              {day}. {month}, {event.schedule.startTime} Uhr
            </span>
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">
                {event.location.venueName ?? event.location.addressLine}, {event.location.city}
              </span>
            </span>
          </div>
        </div>

        {footerRow}
      </div>

      {/* Tablet/Desktop: Datum-Spalte + Zeilenlayout mit Bild rechts */}
      <div className="hidden tablet:grid tablet:grid-cols-[auto_1fr] tablet:items-start tablet:gap-5 desktop:gap-6">
        <div className="flex items-baseline gap-1 py-6">
          <span className="font-heading text-3xl leading-none font-semibold tracking-tight text-primary desktop:text-4xl">
            {day}
          </span>
          <span className="text-[11px] leading-none font-medium tracking-wide text-muted-foreground capitalize">
            {month}
          </span>
        </div>

        <div className="group flex min-h-36 items-stretch gap-4 border-t border-border py-6 desktop:min-h-44 desktop:gap-6">
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div>
              {infoRow}

              <h3 className="mt-2 line-clamp-2 font-heading text-xl leading-tight font-semibold text-foreground">
                {event.title}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3 shrink-0" />
                  {event.schedule.startTime} Uhr
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate">
                    {event.location.venueName ?? event.location.addressLine}, {event.location.city}
                  </span>
                </span>
              </div>
            </div>

            {footerRow}
          </div>

          <div className="relative w-24 shrink-0 overflow-hidden rounded-xl tablet:w-36 desktop:w-44">
            {coverImage}
          </div>
        </div>
      </div>
    </>
  )
}

export default EventListRow
