"use client"

import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"

const ROLE_LABELS: Record<string, string> = {
  user: "Mitglied",
  organizer: "Veranstalter",
  admin: "Admin",
}

const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "English",
}

const PersonalInfoCard = () => {
  const { data: user } = useCurrentUser()

  if (!user) return null

  const fields = [
    { label: "Vorname", value: user.firstName },
    { label: "Nachname", value: user.lastName },
    { label: "Benutzername", value: `@${user.username}` },
    { label: "E-Mail", value: user.email },
    {
      label: "Standort",
      value: [user.location.city, user.location.country].filter(Boolean).join(", ") || "—",
    },
    { label: "Sprache", value: LANGUAGE_LABELS[user.language] ?? user.language },
    { label: "Rolle", value: ROLE_LABELS[user.role] ?? user.role },
  ]

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 tablet:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <User className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Persönliche Informationen
          </h2>
        </div>
        <Button variant="outline" size="sm">
          Bearbeiten
        </Button>
      </div>

      <Separator className="my-6" />

      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 tablet:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">{field.label}</dt>
            <dd className="text-sm font-medium text-foreground">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default PersonalInfoCard
