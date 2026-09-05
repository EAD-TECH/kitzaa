"use client"

import { useState } from "react"
import { ArrowRight, Minus, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EventDTO } from "../../types/event.types"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useJoinEvent } from "../../hooks/useJoinEvent"
import { useLeaveEvent } from "../../hooks/useLeaveEvent"
import { revalidateEventTag } from "../../actions/revalidateEvent"

const AGE_RANGE_SHORT_LABELS: Record<Exclude<EventDTO["ageRange"], "parents">, string> = {
  "0-3": "0-3 J.",
  "4-6": "4-6 J.",
  "7-10": "7-10 J.",
  "10-14": "10-14 J.",
  "all-ages": "Alle Alter",
}

function getParticipantLabel(ageRange: EventDTO["ageRange"]) {
  if (ageRange === "parents") return "Eltern"
  const shortLabel = AGE_RANGE_SHORT_LABELS[ageRange]
  return shortLabel ? `Kinder (${shortLabel})` : "Kinder"
}

interface EventRegistrationCardProps {
  event: EventDTO
  onEventChange: (event: EventDTO) => void
}

const EventRegistrationCard = ({ event, onEventChange }: EventRegistrationCardProps) => {

  const { data: currentUser } = useCurrentUser()
  const isAuthReady = useAuthStore((state) => state.isReady)

  const freeSpots = Math.max(event.capacity.max - event.capacity.current, 0)
  const isFull = freeSpots === 0

  const isJoined = event.participantsPreview.some((p) => p._id === currentUser?._id)

  const [participantCount, setParticipantCount] = useState(1)

  const decrease = () => setParticipantCount((count) => Math.max(1, count - 1))
  const increase = () => setParticipantCount((count) => Math.min(freeSpots, count + 1))

  const price = event.isFree ? null : event.price
  const totalPrice = price ? price.amount * participantCount : 0

  const joinMutation = useJoinEvent(event._id)
  const leaveMutation = useLeaveEvent(event._id)
  const isPending = joinMutation.isPending || leaveMutation.isPending


  const handleJoin = () => {
    joinMutation.mutate(participantCount, {
      onSuccess: (data) => {
        onEventChange(data.event)
        revalidateEventTag(event.slug)
      },
    })
  }

  const handleLeave = () => {
    leaveMutation.mutate(undefined, {
      onSuccess: (data) => {
        onEventChange(data.event)
        revalidateEventTag(event.slug)
      },
    })
  }



  return (
    <div className="order-3 flex w-full flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 tablet:col-span-2 tablet:mx-auto tablet:mt-10 tablet:max-w-xl desktop:order-1 desktop:mx-0 desktop:mt-0 desktop:max-w-none">
      <h2 className="font-heading text-base font-semibold text-foreground">Event Registrierung</h2>

      {price && (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {price.amount},00 €
          </span>
          <span className="text-sm text-muted-foreground">
            / {getParticipantLabel(event.ageRange)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Users className="size-3.5" />
          Anzahl Teilnehmer
        </span>

        <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-input/30 py-1.5 pr-1.5 pl-3">
          <span className="text-sm text-foreground">
            {getParticipantLabel(event.ageRange)}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isFull || isJoined || participantCount <= 1}
              onClick={decrease}
              aria-label="Anzahl verringern"
              className="cursor-pointer"
            >
              <Minus className="size-3.5 cursor-pointer" />
            </Button>
            <span className="w-4 text-center text-sm font-semibold text-foreground">
              {participantCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isFull || isJoined || participantCount >= freeSpots}
              onClick={increase}
              aria-label="Anzahl erhöhen"
              className="cursor-pointer"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {price && (
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-medium text-foreground">Gesamt</span>
          <span className="font-semibold text-foreground">
            {totalPrice} €
          </span>
        </div>
      )}

      <Button
        size="lg"
        className="w-full cursor-pointer"
        disabled={(isFull && !isJoined) || isPending || !isAuthReady}
        onClick={isJoined ? handleLeave : handleJoin}
        variant={isJoined ? "outline" : "default"}
      >
        {isFull && !isJoined
          ? "Ausgebucht"
          : isJoined
            ? "Teilnahme stornieren"
            : price
              ? "Jetzt buchen"
              : "Kostenlos anmelden"}
        {!isFull && !isJoined && <ArrowRight className="size-4" />}
      </Button>

      <span
        className={cn(
          "text-center text-xs font-medium",
          isFull ? "text-destructive" : "text-secondary"
        )}
      >
        {isFull
          ? "Keine freien Plätze mehr verfügbar"
          : `${freeSpots} von ${event.capacity.max} Plätzen frei`}
      </span>
    </div>
  )
}

export default EventRegistrationCard
