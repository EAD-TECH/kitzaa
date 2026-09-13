import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { deleteEvent } from "../api/eventApi"

// eventController.deletee'nin fırlattığı bilinen CustomError mesajları için kullanıcı dostu metinler.
const DELETE_ERROR_MESSAGES: Record<string, string> = {
  "Event not found": "Event nicht gefunden.",
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cancelledReason }: { id: string; cancelledReason: string }) =>
      deleteEvent(id, cancelledReason),
    onError: (err) => {
      const message = err instanceof ApiError
        ? (DELETE_ERROR_MESSAGES[err.message] ?? "Event konnte nicht gelöscht werden. Bitte versuche es erneut.")
        : "Event konnte nicht gelöscht werden. Bitte versuche es erneut."
      toast.error(message)
    },
    onSuccess: () => {
      toast.success("Event wurde abgesagt.")
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
  })
}
