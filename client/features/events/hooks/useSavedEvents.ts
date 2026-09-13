"use client"

import { useQuery } from "@tanstack/react-query"
import { savedEvents } from "../api/eventApi"

export function useSavedEvents() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["events", "saved-events"],
        queryFn: savedEvents,
    })

    return { events: data?.events ?? [], isLoading, isError }
}
