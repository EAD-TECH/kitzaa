"use client"

import { useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useDeleteEvent } from "../hooks/useDeleteEvent"

interface DeleteEventDialogProps {
  eventId: string
  eventTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DeleteEventDialog = ({ eventId, eventTitle, open, onOpenChange }: DeleteEventDialogProps) => {
  const [cancelledReason, setCancelledReason] = useState("")
  const { mutate: deleteEvent, isPending } = useDeleteEvent()

  const handleDelete = () => {
    deleteEvent(
      { id: eventId, cancelledReason },
      {
        onSuccess: () => {
          onOpenChange(false)
          setCancelledReason("")
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) setCancelledReason("")
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event stornieren</DialogTitle>
          <DialogDescription>
            Möchtest du &quot;{eventTitle}&quot; wirklich stornieren? Bereits angemeldete Teilnehmer werden
            benachrichtigt. Dies kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={cancelledReason}
          onChange={(e) => setCancelledReason(e.target.value)}
          placeholder="Grund für die Stornierung (Pflichtfeld)"
        />

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Abbrechen</DialogClose>
          <Button
            variant="destructive"
            disabled={cancelledReason.trim().length === 0 || isPending}
            onClick={handleDelete}
          >
            {isPending ? "Wird storniert…" : "Event stornieren"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteEventDialog
