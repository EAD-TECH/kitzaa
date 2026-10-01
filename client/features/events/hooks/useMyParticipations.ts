"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { flattenPages, getNextPageParam } from "@/lib/api/pagination"
import { myParticipations } from "../api/eventApi"

export function useMyParticipations({ enabled = true }: { enabled?: boolean } = {}) {
    const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["events", "my-participations"],
        queryFn: ({ pageParam }) => myParticipations(pageParam),
        initialPageParam: 1,
        getNextPageParam,
        enabled,
    })

    return {
        events: flattenPages(data?.pages, (page) => page.events),
        count: data?.pages[0]?.details.count,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    }
}
