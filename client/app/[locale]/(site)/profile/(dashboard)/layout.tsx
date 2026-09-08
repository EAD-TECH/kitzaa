"use client"

import type { ReactNode } from "react"

import { useAuthStore } from "@/features/auth/store/authStore"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import ProfileHeader from "@/features/profile/components/ProfileHeader"
import ProfileHeaderSkeleton from "@/features/profile/components/ProfileHeaderSkeleton"
import ProfileTabs from "@/features/profile/components/ProfileTabs"
import type { ProfileStats } from "@/features/profile/types/profile.types"

// TODO: İstatistik API'si bağlanınca gerçek verilerle değiştirilecek
const PLACEHOLDER_STATS: ProfileStats = {
  createdEventsCount: 12,
  registeredEventsCount: 45,
  postsCount: 8,
}

interface DashboardLayoutProps {
  children: ReactNode
}

// Giriş zorunluluğu üst düzey profile/layout.tsx'te — burası sadece dashboard
// sekmelerine (Profil, Meine Events, ...) özel chrome'u (header + tabs) ekliyor.
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isReady = useAuthStore((state) => state.isReady)
  const { data: user } = useCurrentUser()

  const isLoading = !isReady || !user

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10 tablet:px-10">
      {isLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <>
          <ProfileHeader user={user} stats={PLACEHOLDER_STATS} />
          <ProfileTabs />
          {children}
        </>
      )}
    </div>
  )
}
