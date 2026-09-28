// null: sayı yüklenemedi (API hatası) — header bu istatistiği gizler.
export interface ProfileStats {
  createdEventsCount: number | null
  registeredEventsCount: number | null
  postsCount: number | null
}
