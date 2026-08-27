
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { toggleSaveEvent } from '../api/eventApi'
import { useEventsStore } from '../store/EventStore'

const useToggleSaveEvent = () => {

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
        onError: (_err, eventId, context) => {
            context?.wasSaved ? addSavedEventId(eventId) : removeSavedEventId(eventId)
        },

    })
}

export default useToggleSaveEvent