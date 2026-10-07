
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
    // ageRanges bir dizi: MongoDB { ageRanges: "7-10" } sorgusunu "dizi bu değeri içeriyor mu"
    // olarak yorumlar, yani tek bir yaş grubuyla filtrelemek çok gruplu event'leri de bulur.
    if (typeof ageRange === "string") {
        params.set("filter[ageRanges]", ageRange)
    }

    const dateFrom = searchParams.dateFrom
    if (typeof dateFrom === "string" && dateFrom) {
        params.set("filter[schedule.startDate][$gte]", dateFrom)
    }

    const dateTo = searchParams.dateTo
    if (typeof dateTo === "string" && dateTo) {
        params.set("filter[schedule.startDate][$lte]", dateTo)
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

    // En yakın tarihten en uzağa. Aynı gün → başlangıç saatine göre; o da aynıysa _id'ye göre.
    // _id şart: skip/limit sayfalamasında sıralama anahtarı benzersiz değilse MongoDB aynı
    // tarihli event'leri sayfalar arasında farklı sırada döndürebilir → infinite scroll'da
    // bazı event'ler iki kez görünür, bazıları hiç görünmez.
    params.set("sort[schedule.startDate]", "1")
    params.set("sort[schedule.startTime]", "1")
    params.set("sort[_id]", "1")

    return params
}
