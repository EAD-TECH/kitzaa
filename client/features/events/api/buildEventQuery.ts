
export type EventSearchParams = Record<string, string | string[] | undefined>

export const buildEventQuery = (searchParams: EventSearchParams) => {
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

    return params
}
