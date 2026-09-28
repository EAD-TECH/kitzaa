"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { flattenPages, getNextPageParam } from "@/lib/api/pagination"
import { myEvents } from "../api/eventApi"

export function useMyEvents({ enabled = true }: { enabled?: boolean } = {}) {
    const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["events", "my-events"],
        queryFn: ({ pageParam }) => myEvents(pageParam),
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
