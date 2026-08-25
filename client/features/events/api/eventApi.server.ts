import { apiFetchServer } from "@/lib/api/server"
import type { EventListResponse, EventResponse } from "../types/event.types"


type EventSearchParams = Record<string, string | string[] | undefined>

function buildEventQuery(searchParams: EventSearchParams) {
    const params = new URLSearchParams()

    const search = searchParams.search
    if (typeof search === "string" && search.trim()) {
        params.set("search[title]", search.trim())
    }

    const locationType = searchParams.locationType
    if (typeof locationType === "string") {
        params.set("filter[locationType]", locationType)
    }

    const ageRange = searchParams.ageRange
    if (typeof ageRange === "string") {
        params.set("filter[ageRange]", ageRange)
    }

    const category = searchParams.category
    if (category) {
        const slugs = Array.isArray(category) ? category : [category]
        params.set("category", slugs.join(","))
    }

    const organisator = searchParams.organisator
    if (organisator) {
        const values = Array.isArray(organisator) ? organisator : [organisator]
        params.set("organisator", values.join(","))
    }

    const lat = searchParams.lat
    const lng = searchParams.lng
    const radius = searchParams.radius

    if (typeof lat === "string" && typeof lng === "string" && typeof radius === "string") {
        params.set("lat", lat)
        params.set("lng", lng)
        params.set("radius", radius)
    }

    const page = searchParams.page
    if (typeof page === "string") {
        params.set("page", page)
    }

    return params.toString()
}


export const getEventsServer = async (searchParams: EventSearchParams = {}) => {

    const query = buildEventQuery(searchParams)

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
