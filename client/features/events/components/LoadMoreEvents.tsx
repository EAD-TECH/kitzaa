"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { useInfiniteEvents } from "../hooks/useInfiniteEvents"
import EventCard from "./EventCard"
import { EVENT_GRID_CLASSNAME } from "./EventList"

interface LoadMoreEventsProps {
    initialNextPage: number | null
}

const LoadMoreEvents = ({ initialNextPage }: LoadMoreEventsProps) => {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const { events, hasMore, hasNextPage, isFetchingNextPage, fetchNextPage } =
        useInfiniteEvents(initialNextPage)

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

    return (
        <>
            <div className={EVENT_GRID_CLASSNAME}>
                {events.map((event) => (
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
