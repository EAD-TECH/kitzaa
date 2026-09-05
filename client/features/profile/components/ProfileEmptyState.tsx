import type { LucideIcon } from "lucide-react"

interface ProfileEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

const ProfileEmptyState = ({ icon: Icon, title, description }: ProfileEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default ProfileEmptyState
