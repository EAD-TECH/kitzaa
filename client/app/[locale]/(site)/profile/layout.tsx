"use client"

import { useEffect, type ReactNode } from "react"

import { useRouter } from "@/i18n/navigation"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"

interface ProfileLayoutProps {
  children: ReactNode
}

// Tüm /profile/* rotaları için ortak giriş zorunluluğu — dashboard sekmelerinin
// (ProfileHeader/ProfileTabs) altında değil burada duruyor, çünkü events-erstellen
// gibi dashboard chrome'u istemeyen alt rotalar da bu korumayı miras almalı.
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter()
  const isReady = useAuthStore((state) => state.isReady)
  const { data: user } = useCurrentUser()

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login")
    }
  }, [isReady, user, router])

  return <>{children}</>
}
