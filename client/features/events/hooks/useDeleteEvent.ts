import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { useTranslations } from "next-intl"
import { deleteEvent } from "../api/eventApi"

const DELETE_ERROR_KEYS: Record<string, "eventNotFound"> = {
  "Event not found": "eventNotFound",
}

export const useDeleteEvent = () => {
  const t = useTranslations("Events")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cancelledReason }: { id: string; cancelledReason: string }) =>
      deleteEvent(id, cancelledReason),
    onError: (err) => {
      const errorKey = err instanceof ApiError ? DELETE_ERROR_KEYS[err.message] : undefined
      const message = errorKey ? t(errorKey) : t("cancelFailed")
      toast.error(message)
    },
    onSuccess: () => {
      toast.success(t("cancelledToast"))
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
  })
}
