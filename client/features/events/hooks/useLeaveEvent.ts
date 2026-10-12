
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { leaveEvent } from "../api/eventApi"
import { useTranslations } from "next-intl"
import { ApiError } from "@/lib/api/client"

const LEAVE_ERROR_KEYS: Record<string, "eventNotFound" | "notJoined"> = {
  "Event not found": "eventNotFound",
  "You have not joined this event.": "notJoined",
}

export const useLeaveEvent = (eventId: string) => {
  const t = useTranslations("Events")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => leaveEvent(eventId),
    onSuccess: () => {
      toast.success(t("left"))
      queryClient.invalidateQueries({ queryKey: ["events", "my-participations"] })
    },
    onError: (err) => {
      const errorKey = err instanceof ApiError ? LEAVE_ERROR_KEYS[err.message] : undefined
      const message = errorKey ? t(errorKey) : t("leaveFailed")
      toast.error(message)
    },
  })
}
