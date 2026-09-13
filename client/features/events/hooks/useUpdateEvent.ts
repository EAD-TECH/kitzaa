import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { updateEvent } from "../api/eventApi"
import type { UpdateEventFormValues } from "../validations/event.schema"

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventFormValues }) => updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
    onError: (err) => {
      const message = err instanceof ApiError
        ? err.message
        : "Event konnte nicht aktualisiert werden. Bitte versuche es erneut."
      toast.error(message)
    },
  })
}
