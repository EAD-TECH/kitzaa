import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { deleteEvent } from "../api/eventApi"

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cancelledReason }: { id: string; cancelledReason: string }) =>
      deleteEvent(id, cancelledReason),
    onSuccess: () => {
      toast.success("Event wurde storniert.")
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
    onError: (err) => {
      const message = err instanceof ApiError
        ? err.message
        : "Event konnte nicht storniert werden. Bitte versuche es erneut."
      toast.error(message)
    },
  })
}
