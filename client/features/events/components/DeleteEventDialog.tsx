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
import { useTranslations } from "next-intl"
import { useDeleteEvent } from "../hooks/useDeleteEvent"

const MIN_REASON_LENGTH = 5

interface DeleteEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventTitle: string
}

export function DeleteEventDialog({ open, onOpenChange, eventId, eventTitle }: DeleteEventDialogProps) {
  const t = useTranslations("Events")
  const common = useTranslations("Common")
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
          <DialogTitle>{t("cancelEvent")}</DialogTitle>
          <DialogDescription>
            {t("cancelEventBody", { title: eventTitle })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label htmlFor="cancelledReason" className="text-sm font-medium text-foreground">
            {t("cancelReason")}
          </label>
          <Textarea
            id="cancelledReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("cancelReasonPlaceholder")}
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {common("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={reason.trim().length < MIN_REASON_LENGTH || isPending}
            onClick={handleConfirm}
          >
            {isPending ? t("cancelling") : t("cancelEvent")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
