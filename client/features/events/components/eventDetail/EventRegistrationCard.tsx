"use client"

import { useState } from "react"
import { ArrowRight, Minus, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { AgeRange, EventDTO } from "../../types/event.types"
import { sortAgeRanges } from "../../utils/ageRange"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useJoinEvent } from "../../hooks/useJoinEvent"
import { useLeaveEvent } from "../../hooks/useLeaveEvent"
import { revalidateEventTag } from "../../actions/revalidateEvent"

const AGE_RANGE_SHORT_LABELS: Record<Exclude<AgeRange, "parents">, string> = {
  "0-3": "0-3 J.",
  "4-6": "4-6 J.",
  "7-10": "7-10 J.",
  "10-14": "10-14 J.",
  "all-ages": "Alle Alter",
}

function getParticipantLabel(ageRanges: EventDTO["ageRanges"]) {
  const childRanges = sortAgeRanges(ageRanges ?? []).filter(
    (r): r is Exclude<AgeRange, "parents"> => r !== "parents"
  )
  const includesParents = ageRanges?.includes("parents") ?? false

  if (includesParents && childRanges.length === 0) return "Eltern"
  // Hem ebeveyn hem çocuk gruplarına açık event'te tek bir kişi tipi yok.
  if (includesParents) return "Teilnehmer"
  if (childRanges.length === 0) return "Kinder"
  return `Kinder (${childRanges.map((r) => AGE_RANGE_SHORT_LABELS[r]).join(", ")})`
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

  // Onaylanacak işlem dialog açılırken sabitlenir: başarıdan sonra isJoined hemen
  // değiştiği için içerik isJoined'a bağlı olsaydı kapanma animasyonunda metin atlardı.
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"join" | "leave">("join")

  const openConfirm = () => {
    setConfirmAction(isJoined ? "leave" : "join")
    setConfirmOpen(true)
  }

  // İstek sürerken dialog kapatılamaz; hata olursa açık kalır (toast hook'ta gösteriliyor).
  const handleConfirmOpenChange = (next: boolean) => {
    if (!isPending) setConfirmOpen(next)
  }

  const handleSuccess = (updatedEvent: EventDTO) => {
    onEventChange(updatedEvent)
    revalidateEventTag(event.slug)
    setConfirmOpen(false)
  }

  const handleConfirm = () => {
    if (confirmAction === "join") {
      joinMutation.mutate(participantCount, { onSuccess: (data) => handleSuccess(data.event) })
    } else {
      leaveMutation.mutate(undefined, { onSuccess: (data) => handleSuccess(data.event) })
    }
  }

  const isJoinConfirm = confirmAction === "join"


  return (
    <div className="order-3 flex w-full flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 tablet:col-span-2 tablet:mx-auto tablet:mt-10 tablet:max-w-xl desktop:order-1 desktop:mx-0 desktop:mt-0 desktop:max-w-none">
      <h2 className="font-heading text-base font-semibold text-foreground">Event Registrierung</h2>

      {price && (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {price.amount},00 €
          </span>
          <span className="text-sm text-muted-foreground">
            / {getParticipantLabel(event.ageRanges)}
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
            {getParticipantLabel(event.ageRanges)}
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
        onClick={openConfirm}
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

      <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isJoinConfirm ? "Anmeldung bestätigen" : "Teilnahme stornieren?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isJoinConfirm ? (
                <>
                  Du meldest {participantCount} {participantCount === 1 ? "Person" : "Personen"} für
                  „{event.title}“ an.
                  {price && ` Gesamtpreis: ${totalPrice} €.`}
                </>
              ) : (
                <>
                  Deine Anmeldung für „{event.title}“ wird storniert und deine Plätze werden
                  freigegeben. Ist das Event danach ausgebucht, kannst du dich eventuell nicht
                  erneut anmelden.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              variant={isJoinConfirm ? "default" : "destructive"}
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isJoinConfirm
                ? isPending ? "Wird angemeldet…" : "Verbindlich anmelden"
                : isPending ? "Wird storniert…" : "Teilnahme stornieren"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EventRegistrationCard
