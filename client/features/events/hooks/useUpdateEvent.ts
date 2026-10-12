import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { updateEvent } from "../api/eventApi"
import { useTranslations } from "next-intl"
import type { UpdateEventFormValues } from "../validations/event.schema"

const UPDATE_ERROR_KEYS: Record<string, "editLocked"> = {
  "Cancelled or completed events cannot be edited.": "editLocked",
}

export const useUpdateEvent = () => {
  const t = useTranslations("Events")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventFormValues }) =>
      updateEvent(id, payload),
    onError: (err) => {
      const errorKey = err instanceof ApiError ? UPDATE_ERROR_KEYS[err.message] : undefined
      const message = errorKey ? t(errorKey) : t("updateFailed")
      toast.error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] })
    },
  })
}
