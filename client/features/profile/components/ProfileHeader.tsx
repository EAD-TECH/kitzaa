"use client"

import { toast } from "sonner"
import { CalendarDays, Globe, MapPin, Pencil, Plus, Share2 } from "lucide-react"
import { FaUser } from "react-icons/fa"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import type { AuthUser } from "@/features/auth/types/authTypes"
import type { ProfileStats } from "../types/profile.types"

function formatMemberSince(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  })
}

const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "English",
}

interface ProfileHeaderProps {
  user: AuthUser
  stats: ProfileStats
}

const ProfileHeader = ({ user, stats }: ProfileHeaderProps) => {
  const fullName = `${user.firstName} ${user.lastName}`

  const metaItems = [
    { icon: MapPin, label: `${user.location.city}, ${user.location.country}` },
    { icon: CalendarDays, label: `Mitglied seit ${formatMemberSince(user.createdAt)}` },
    { icon: Globe, label: LANGUAGE_LABELS[user.language] ?? user.language },
  ]

  const statItems = [
    { label: "Erstellte Events", value: stats.createdEventsCount },
    { label: "Registrierte Events", value: stats.registeredEventsCount },
    { label: "Geteilte Beiträge", value: stats.postsCount },
  ]

  const handleShare = async () => {
    const shareData = { title: fullName, url: window.location.href }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // Nutzer hat den Teilen-Dialog abgebrochen
      }
      return
    }

    await navigator.clipboard.writeText(window.location.href)
    toast.success("Link kopiert")
  }

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 tablet:p-8">
      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start tablet:justify-between">
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
          <div className="relative w-fit">
            <Avatar className="size-24 tablet:size-28">
              <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-[#e4e7e9] text-[#adb5b9]">
                <FaUser className="size-8" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute -right-1 -bottom-1 rounded-full shadow-sm"
              aria-label="Profilbild ändern"
            >
              <Pencil className="size-3.5" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground tablet:text-3xl">
                {fullName}
              </h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {metaItems.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className="size-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button render={<Link href="/events/create" />} nativeButton={false} size="sm">
            <Plus className="size-4" />
            Event erstellen
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="size-4" />
            Profil teilen
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 border-t border-border pt-6 ">
        {statItems.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-0.5 text-center">
            <span className="font-heading text-xl font-bold text-primary tablet:text-2xl">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileHeader
