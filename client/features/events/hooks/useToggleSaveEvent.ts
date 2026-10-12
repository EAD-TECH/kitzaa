
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { toggleSaveEvent } from '../api/eventApi'
import { useTranslations } from "next-intl"
import { useEventsStore } from '../store/EventStore'

const useToggleSaveEvent = () => {
    const t = useTranslations("Events")
    const queryClient = useQueryClient()
    const savedEventIds = useEventsStore((state) => state.savedEventIds)
    const addSavedEventId = useEventsStore((state) => state.addSavedEventId)
    const removeSavedEventId = useEventsStore((state) => state.removeSavedEventId)


    return useMutation({
        mutationFn: (eventId: string) => toggleSaveEvent(eventId),
        onMutate: (eventId: string) => {
            const wasSaved = savedEventIds.has(eventId)
             wasSaved ? removeSavedEventId(eventId) : addSavedEventId(eventId)
             return {wasSaved}
        },
        onSuccess: (data) => {
            toast.success(data.saved ? t("savedToast") : t("unsavedToast"))
            queryClient.invalidateQueries({ queryKey: ["events", "saved-events"] })
        },
        onError: (_err, eventId, context) => {
            context?.wasSaved ? addSavedEventId(eventId) : removeSavedEventId(eventId)
            toast.error(t("saveFailed"))
        },

    })
}

export default useToggleSaveEvent