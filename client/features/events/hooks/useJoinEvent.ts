

import { useMutation } from '@tanstack/react-query'
import { joinEvent } from '../api/eventApi'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'

const JOIN_ERROR_MESSAGES: Record<string, string> = {
  "Event not found": "Veranstaltung nicht gefunden.",
  "You can only join approved events.": "Du kannst nur genehmigten Veranstaltungen beitreten.",
  "You have already joined this event.": "Du nimmst bereits an dieser Veranstaltung teil.",
  "This event is full.": "Diese Veranstaltung ist ausgebucht.",
  "This event is full or you have already joined.": "Diese Veranstaltung ist ausgebucht oder du nimmst bereits teil.",
}

export const useJoinEvent = (eventId: string) => {
  return useMutation({
    mutationFn: (participantCount: number) => joinEvent(eventId, participantCount),
    onError: (err) => {
      const message = err instanceof ApiError
        ? (JOIN_ERROR_MESSAGES[err.message] ?? "Anmeldung fehlgeschlagen. Bitte versuche es erneut.")
        : "Anmeldung fehlgeschlagen. Bitte versuche es erneut."
      toast.error(message)
    },
  })
}

