"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { flattenPages, getNextPageParam } from "@/lib/api/pagination"
import { savedEvents } from "../api/eventApi"

export function useSavedEvents() {
    const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["events", "saved-events"],
        queryFn: ({ pageParam }) => savedEvents(pageParam),
        initialPageParam: 1,
        getNextPageParam,
    })

    return {
        events: flattenPages(data?.pages, (page) => page.events),
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    }
}
