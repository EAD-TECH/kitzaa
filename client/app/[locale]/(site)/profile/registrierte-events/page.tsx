import { Ticket } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"

const RegistrierteEventsPage = () => {
  return (
    <ProfileEmptyState
      icon={Ticket}
      title="Noch keine Registrierungen"
      description="Events, für die du dich angemeldet hast, erscheinen hier."
    />
  )
}

export default RegistrierteEventsPage
