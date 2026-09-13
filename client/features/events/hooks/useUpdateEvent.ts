import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { updateEvent } from "../api/eventApi"
import type { UpdateEventFormValues } from "../validations/event.schema"

// eventController.update'in fırlattığı bilinen CustomError mesajları için kullanıcı dostu metinler.
const UPDATE_ERROR_MESSAGES: Record<string, string> = {
  "Cancelled or completed events cannot be edited.":
    "Abgesagte oder abgeschlossene Events können nicht bearbeitet werden.",
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventFormValues }) =>
      updateEvent(id, payload),
    onError: (err) => {
      const message = err instanceof ApiError
        ? (UPDATE_ERROR_MESSAGES[err.message] ?? "Event konnte nicht aktualisiert werden. Bitte versuche es erneut.")
        : "Event konnte nicht aktualisiert werden. Bitte versuche es erneut."
      toast.error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
  })
}
