import { apiFetchServer } from "@/lib/api/server"
import type { EventListResponse, EventResponse } from "../types/event.types"


export const getEventsServer = async () => {

    return apiFetchServer<EventListResponse>("/api/v1/events", {
        method: "GET",
        revalidate: 60,
        tags: ["events"],
    })
}


export const readEventServer = async (slug: string) => {

    return apiFetchServer<EventResponse>(`/api/v1/events/${slug}`, {
        method: "GET",
        revalidate: 60,
        tags: [`event-${slug}`],
    })
}
