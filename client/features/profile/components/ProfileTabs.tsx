"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/profile", label: "Profil" },
  { href: "/profile/meine-events", label: "Meine Events" },
  { href: "/profile/registrierte-events", label: "Registrierte Events" },
  { href: "/profile/meine-beitraege", label: "Meine Beiträge" },
  { href: "/profile/sicherheit", label: "Sicherheit" },
] as const

const ProfileTabs = () => {
  const pathname = usePathname()

  return (
    <nav className="flex gap-8 tablet:gap-14 desktop:gap-20 overflow-x-auto overflow-y-hidden border-b border-border">
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
            {tab.label}
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
