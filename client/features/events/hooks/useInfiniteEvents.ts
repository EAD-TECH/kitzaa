"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getEvents } from "../api/eventApi"
import { buildEventQuery, type EventSearchParams } from "../api/buildEventQuery"

function searchParamsToRecord(sp: URLSearchParams): EventSearchParams {
    const record: EventSearchParams = {}
    for (const key of new Set(sp.keys())) {
        const values = sp.getAll(key)
        record[key] = values.length > 1 ? values : values[0]
    }
    return record
}

export function useInfiniteEvents(initialNextPage: number | null) {
    const searchParams = useSearchParams()
    const hasMore = initialNextPage !== null
    const filterKey = searchParams.toString()

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["events", "infinite", filterKey],
        queryFn: ({ pageParam }) => {
            const params = buildEventQuery(searchParamsToRecord(searchParams))
            params.set("page", String(pageParam))
            return getEvents(params)
        },
        initialPageParam: initialNextPage ?? 2,
        getNextPageParam: (lastPage) =>
            lastPage.details.pages === false || lastPage.details.pages.next === false
                ? undefined
                : lastPage.details.pages.next,
        enabled: hasMore,
    })

    const events = data?.pages.flatMap((page) => page.events) ?? []

    return { events, hasMore, hasNextPage, isFetchingNextPage, fetchNextPage }
}
