"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/profile", labelKey: "tabProfile" },
  { href: "/profile/meine-events", labelKey: "tabMyEvents" },
  { href: "/profile/registrierte-events", labelKey: "tabRegistered" },
  { href: "/profile/gespeicherte-events", labelKey: "tabSaved" },
  { href: "/profile/meine-beitraege", labelKey: "tabPosts" },
  { href: "/profile/sicherheit", labelKey: "tabSecurity" },
] as const

const ProfileTabs = () => {
  const t = useTranslations("Profile")
  const pathname = usePathname()

  return (
    <nav className="flex gap-6 tablet:gap-10 desktop:gap-14 overflow-x-auto overflow-y-hidden border-b border-border">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "group relative shrink-0 whitespace-nowrap pb-3 text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(tab.labelKey)}
            <span
              className={cn(
                "absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-primary transition-transform duration-300 ease-spring",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-primary/40"
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}

export default ProfileTabs
