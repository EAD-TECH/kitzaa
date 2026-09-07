"use client"

import { useEffect, type ReactNode } from "react"

import { useRouter } from "@/i18n/navigation"
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

interface ProfileLayoutProps {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter()
  const isReady = useAuthStore((state) => state.isReady)
  const { data: user } = useCurrentUser()

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login")
    }
  }, [isReady, user, router])

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
