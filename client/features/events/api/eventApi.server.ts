import { apiFetchServer } from "@/lib/api/server"
import type { EventListResponse, EventResponse } from "../types/event.types"
import { buildEventQuery, type EventSearchParams } from "./buildEventQuery"


export const getEventsServer = async (searchParams: EventSearchParams = {}) => {

    const params = buildEventQuery(searchParams)

    const page = searchParams.page
    if(typeof page === "string") {
        params.set("page", page)
    }

    const query = params.toString()

    return apiFetchServer<EventListResponse>(`/api/v1/events${query ? `?${query}` : ""}`, {
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
