"use client"

import { useQuery } from "@tanstack/react-query"
import { myParticipations } from "../api/eventApi"

export function useMyParticipations() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["events", "my-participations"],
        queryFn: myParticipations,
    })

    return { events: data?.events ?? [], isLoading, isError }
}
