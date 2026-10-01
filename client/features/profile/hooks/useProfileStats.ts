"use client"

import { useMyEvents } from "@/features/events/hooks/useMyEvents"
import { useMyParticipations } from "@/features/events/hooks/useMyParticipations"
import { useMyPosts } from "@/features/social/hooks/socialHooks"
import type { ProfileStats } from "../types/profile.types"

// Tab sayfalarıyla aynı hook'lar (aynı queryKey) kullanıldığı için React Query
// istekleri tekilleştirir ve join/leave/post sonrası invalidation sayıları da günceller.
// enabled: token hazır olmadan istek atılırsa 401 alınır ve hata cache'lenir.
export function useProfileStats({ enabled }: { enabled: boolean }) {
  const queries = [
    useMyEvents({ enabled }),
    useMyParticipations({ enabled }),
    useMyPosts({ enabled }),
  ]
  const [myEvents, participations, posts] = queries

  const stats: ProfileStats = {
    createdEventsCount: myEvents.count ?? null,
    registeredEventsCount: participations.count ?? null,
    postsCount: posts.count ?? null,
  }

  // Ne veri ne hata var = hâlâ yükleniyor (retry sırasında da skeleton kalır).
  const isLoading = queries.some((query) => query.count === undefined && !query.isError)

  return { stats, isLoading }
}
