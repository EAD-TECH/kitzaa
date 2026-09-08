import { PartyPopper } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"

const MeineEventsPage = () => {
  return (
    <ProfileEmptyState
      icon={PartyPopper}
      title="Noch keine Events erstellt"
      description="Deine selbst erstellten Events erscheinen hier, sobald du eines veröffentlichst."
    />
  )
}

export default MeineEventsPage
