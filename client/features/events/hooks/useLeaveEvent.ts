
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { leaveEvent } from "../api/eventApi"
import { ApiError } from "@/lib/api/client"

const LEAVE_ERROR_MESSAGES: Record<string, string> = {
  "Event not found": "Veranstaltung nicht gefunden.",
  "You have not joined this event.": "Du nimmst nicht an dieser Veranstaltung teil.",
}

export const useLeaveEvent = (eventId: string) => {
  return useMutation({
    mutationFn: () => leaveEvent(eventId),
    onError: (err) => {
      const message = err instanceof ApiError
        ? (LEAVE_ERROR_MESSAGES[err.message] ?? "Abmeldung fehlgeschlagen. Bitte versuche es erneut.")
        : "Abmeldung fehlgeschlagen. Bitte versuche es erneut."
      toast.error(message)
    },
  })
}
