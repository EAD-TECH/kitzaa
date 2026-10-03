import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { createEvent } from "../api/eventApi"
import { useTrackActions } from "@/features/socket/hooks/useTrackActions"

// eventController.create'in fırlattığı bilinen CustomError mesajları için kullanıcı dostu metinler.
const CREATE_ERROR_MESSAGES: Record<string, string> = {
  "You must be an organizer to create paid events.": "Du musst Organisator sein, um kostenpflichtige Events zu erstellen.",
}

export const useCreateEvent = () => {
  const { handleTrackActions } = useTrackActions()

  return useMutation({
    mutationFn: createEvent,
    onError: (err) => {
      const message = err instanceof ApiError
        ? (CREATE_ERROR_MESSAGES[err.message] ?? "Event konnte nicht erstellt werden. Bitte versuche es erneut.")
        : "Event konnte nicht erstellt werden. Bitte versuche es erneut."
      toast.error(message)
    },
    onSuccess: (data) => {
      handleTrackActions({
        type: "event_application",
        title: "Yeni etkinlik başvurusu",
        description: `"${data.event.title}" başlıklı etkinlik onaya gönderildi.`,
        relatedId: data.event._id,
      })
    }
  })
}
