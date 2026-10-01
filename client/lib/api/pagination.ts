// server/src/middlewares/queryHandler.ts varsayılan limiti 6; liste istekleri limit'i
// açıkça gönderir ki sayfa boyutu client'ta tek yerden yönetilsin.
export const DEFAULT_PAGE_SIZE = 12

// getModelListDetails'in döndüğü sayfalama bilgisinin useInfiniteQuery için gereken kısmı.
export interface PaginatedResponse {
  details: {
    count: number
    pages: false | { next: number | false }
  }
}

// Skip tabanlı sayfalamada sıralama sabit olmalı; yoksa sayfalar arasında kayıt
// atlanabilir veya tekrarlanabilir. En yeni kayıt en üstte.
export function buildPageQuery(page: number, limit = DEFAULT_PAGE_SIZE) {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))
  params.set("sort[createdAt]", "-1")
  return params
}

export function getNextPageParam(lastPage: PaginatedResponse) {
  const { pages } = lastPage.details
  return pages === false || pages.next === false ? undefined : pages.next
}

// Sayfalar yüklenirken listeye kayıt eklenirse (ör. yeni bildirim) skip kayar ve bir
// kayıt iki sayfada birden gelebilir; aynı _id'yi ikinci kez göstermemek için.
export function flattenPages<TPage, TItem extends { _id: string }>(
  pages: TPage[] | undefined,
  getItems: (page: TPage) => TItem[],
): TItem[] {
  const seen = new Set<string>()
  const items: TItem[] = []

  for (const page of pages ?? []) {
    for (const item of getItems(page)) {
      if (seen.has(item._id)) continue
      seen.add(item._id)
      items.push(item)
    }
  }

  return items
}
