import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { createEvent } from "../api/eventApi"
import { useTranslations } from "next-intl"
import { useTrackActions } from "@/features/socket/hooks/useTrackActions"

const CREATE_ERROR_KEYS: Record<string, "paidOrganizerOnly"> = {
  "You must be an organizer to create paid events.": "paidOrganizerOnly",
}

export const useCreateEvent = () => {
  const t = useTranslations("Events")
  const { handleTrackActions } = useTrackActions()

  return useMutation({
    mutationFn: createEvent,
    onError: (err) => {
      const errorKey = err instanceof ApiError ? CREATE_ERROR_KEYS[err.message] : undefined
      const message = errorKey ? t(errorKey) : t("createFailed")
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
