"use client"

import { useQuery } from "@tanstack/react-query"
import { myEvents } from "../api/eventApi"

export function useMyEvents() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["events", "my-events"],
        queryFn: myEvents,
    })

    return { events: data?.events ?? [], isLoading, isError }
}
