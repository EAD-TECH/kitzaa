import { apiFetchServer } from "@/lib/api/server"
import type { EventCategoryListResponse, EventCategoryResponse } from "../types/eventCategory.types"


export const getCategoriesServer = async () => {

    return apiFetchServer<EventCategoryListResponse>("/api/v1/category", {
        method: "GET",
        revalidate: 3600,
        tags: ["categories"],
    })

}

export const getCategoryServer = async (id: string) => {

    return apiFetchServer<EventCategoryResponse>(`/api/v1/category/${id}`, {
        method: "GET",
        revalidate: 3600,
        tags: [`category-${id}`],
    })

}