import { apiFetch } from "@/lib/api/client"
import type {
    EventListResponse,
    NearbyEventsResponse,
    EventResponse,
    EventLikeResponse,
    EventParticipantsResponse,
} from "../types/event.types"
import type { CreateEventFormValues, UpdateEventFormValues } from "../validations/event.schema"



export const createEvent = async (payload: CreateEventFormValues) => {

    return apiFetch<EventResponse>(`/api/v1/events`, {
        method: "POST",
        body: payload,
    })

}

export const updateEvent = async (id: string, payload: UpdateEventFormValues) => {

    return apiFetch<EventResponse>(`/api/v1/events/${id}`, {
        method: "PUT",
        body: payload,
    })


}

export const deleteEvent = async (id: string, cancelledReason: string) => {

    return apiFetch<void>(`/api/v1/events/${id}`, {
        method: "DELETE",
        body: { cancelledReason },
    })
}



export const joinEvent = async (id: string) => {

    return apiFetch<EventResponse>(`/api/v1/events/${id}/join`, { method: "POST" })

}


export const leaveEvent = async (id: string) => {


    return apiFetch<EventResponse>(`/api/v1/events/${id}/leave`, { method: "POST" })
}


export const likeEvent = async (id: string) => {

    return apiFetch<EventLikeResponse>(`/api/v1/events/${id}/like`, { method: "POST" })
}


export const myEvents = async () => {

    return apiFetch<EventListResponse>(`/api/v1/events/my-events`, { method: "GET" })
}


export const myParticipations = async () => {

    return apiFetch<EventListResponse>(`/api/v1/events/my-participations`, { method: "GET" })
}


export const participants = async (id: string) => {

    return apiFetch<EventParticipantsResponse>(`/api/v1/events/${id}/participants`, { method: "GET" })
}


export const nearbyEvents = async (lat: number, lng: number, radius?: number) => {

    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
    if (radius !== undefined) params.set("radius", String(radius))

    return apiFetch<NearbyEventsResponse>(`/api/v1/events/nearby?${params}`, { method: "GET" })
}