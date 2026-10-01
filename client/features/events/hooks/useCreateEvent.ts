import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { createEvent } from "../api/eventApi"

// eventController.create'in fırlattığı bilinen CustomError mesajları için kullanıcı dostu metinler.
const CREATE_ERROR_MESSAGES: Record<string, string> = {
  "You must be an organizer to create paid events.": "Du musst Organisator sein, um kostenpflichtige Events zu erstellen.",
}

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
    onError: (err) => {
      const message = err instanceof ApiError
        ? (CREATE_ERROR_MESSAGES[err.message] ?? "Event konnte nicht erstellt werden. Bitte versuche es erneut.")
        : "Event konnte nicht erstellt werden. Bitte versuche es erneut."
      toast.error(message)
    },
  })
}
