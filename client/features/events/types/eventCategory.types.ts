import type { ListDetails } from "./event.types"

export interface EventCategoryDTO {
    _id: string
    name: string
    slug: string
    description: string | null
    icon?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface EventCategoryListResponse {
    error: false
    details: ListDetails
    categories: EventCategoryDTO[]
}

export interface EventCategoryResponse {
    error: false
    category: EventCategoryDTO
}
