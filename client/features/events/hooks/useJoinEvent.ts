

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinEvent } from '../api/eventApi'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { useTranslations } from "next-intl"
import { useTrackActions } from "@/features/socket/hooks/useTrackActions"

const JOIN_ERROR_KEYS: Record<string, "eventNotFound" | "joinApprovedOnly" | "alreadyJoined" | "eventFull" | "eventFullOrJoined"> = {
  "Event not found": "eventNotFound",
  "You can only join approved events.": "joinApprovedOnly",
  "You have already joined this event.": "alreadyJoined",
  "This event is full.": "eventFull",
  "This event is full or you have already joined.": "eventFullOrJoined",
}

export const useJoinEvent = (eventId: string) => {
  const t = useTranslations("Events")
  const queryClient = useQueryClient()
  const {handleTrackActions}=useTrackActions()

  return useMutation({
    mutationFn: (participantCount: number) => joinEvent(eventId, participantCount),
    onSuccess: (data) => {
      toast.success(t("joined"))
      queryClient.invalidateQueries({ queryKey: ["events", "my-participations"] })
      const user = queryClient.getQueryData<{
          firstName?: string;
          lastName?: string;
        }>(["currentUser"]);
        const userName = user ? `${user.firstName} ${user.lastName}` : "Biri";

        handleTrackActions({
        type: "event_join",
        title: "Kullnıcı etkinliğe katıldı",
        description: `"${userName}" başlıklı etkinlige katıldı.`,
        relatedId: data.event._id,
        linkUrl: `/events/${data.event._id}`,
      })





    },
    onError: (err) => {
      const errorKey = err instanceof ApiError ? JOIN_ERROR_KEYS[err.message] : undefined
      const message = errorKey ? t(errorKey) : t("joinFailed")
      toast.error(message)
    },
  })
}

