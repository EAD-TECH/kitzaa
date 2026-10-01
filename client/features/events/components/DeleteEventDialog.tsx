"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useDeleteEvent } from "../hooks/useDeleteEvent"

const MIN_REASON_LENGTH = 5

interface DeleteEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventTitle: string
}

export function DeleteEventDialog({ open, onOpenChange, eventId, eventTitle }: DeleteEventDialogProps) {
  const [reason, setReason] = useState("")
  const { mutate: deleteEvent, isPending } = useDeleteEvent()

  const handleOpenChange = (next: boolean) => {
    if (!isPending) {
      onOpenChange(next)
      if (!next) setReason("")
    }
  }

  const handleConfirm = () => {
    deleteEvent(
      { id: eventId, cancelledReason: reason.trim() },
      {
        onSuccess: () => {
          setReason("")
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event absagen</DialogTitle>
          <DialogDescription>
            Möchtest du „{eventTitle}“ wirklich absagen? Bereits angemeldete Teilnehmer werden
            benachrichtigt. Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label htmlFor="cancelledReason" className="text-sm font-medium text-foreground">
            Grund für die Absage *
          </label>
          <Textarea
            id="cancelledReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="z.B. Zu wenige Anmeldungen, Veranstaltungsort nicht mehr verfügbar…"
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Abbrechen
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={reason.trim().length < MIN_REASON_LENGTH || isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Wird abgesagt…" : "Event absagen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
