import { ShieldCheck } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"

const SicherheitPage = () => {
  return (
    <ProfileEmptyState
      icon={ShieldCheck}
      title="Sicherheitseinstellungen"
      description="Passwort ändern und weitere Sicherheitseinstellungen folgen in Kürze."
    />
  )
}

export default SicherheitPage
