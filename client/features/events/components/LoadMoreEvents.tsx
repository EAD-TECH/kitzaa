"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getEvents } from "../api/eventApi"
import { buildEventQuery, type EventSearchParams } from "../api/buildEventQuery"
import EventCard from "./EventCard"
import { EVENT_GRID_CLASSNAME } from "./EventList"

interface LoadMoreEventsProps {
    initialNextPage: number | null
}

function searchParamsToRecord(sp: URLSearchParams): EventSearchParams {
    const record: EventSearchParams = {}
    for (const key of new Set(sp.keys())) {
        const values = sp.getAll(key)
        record[key] = values.length > 1 ? values : values[0]
    }
    return record
}

const LoadMoreEvents = ({ initialNextPage }: LoadMoreEventsProps) => {
    const searchParams = useSearchParams()
    const sentinelRef = useRef<HTMLDivElement>(null)  // listenin sonundaki sensorumuz
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

    useEffect(() => {
        if (!hasMore) return

        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { rootMargin: "100px" }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, hasNextPage, isFetchingNextPage, fetchNextPage])

    if (!hasMore) return null

    const loadedEvents = data?.pages.flatMap((page) => page.events) ?? []

    return (
        <>
            <div className={EVENT_GRID_CLASSNAME}>
                {loadedEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>

            {(hasNextPage || isFetchingNextPage) && (
                <div ref={sentinelRef} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    )}
                </div>
            )}
        </>
    )
}

export default LoadMoreEvents
