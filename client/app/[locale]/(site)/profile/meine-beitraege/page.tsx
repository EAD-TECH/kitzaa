import { MessageSquare } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"

const MeineBeitraegePage = () => {
  return (
    <ProfileEmptyState
      icon={MessageSquare}
      title="Noch keine Beiträge"
      description="Deine geteilten Beiträge und Kommentare erscheinen hier."
    />
  )
}

export default MeineBeitraegePage
