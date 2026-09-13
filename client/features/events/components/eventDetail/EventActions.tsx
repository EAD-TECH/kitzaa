"use client"

import { toast } from "sonner"
import { Bookmark, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useEventsStore } from "../../store/EventStore"
import useToggleSaveEvent from "../../hooks/useToggleSaveEvent"
import type { EventDTO } from "../../types/event.types"

interface EventActionsProps {
  event: EventDTO
}

const EventActions = ({ event }: EventActionsProps) => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isSaved = useEventsStore((state) => state.savedEventIds.has(event._id))
  const { mutate: toggleSave } = useToggleSaveEvent()

  const handleToggleSave = () => {
    if (!accessToken) {
      toast.error("Bitte melde dich an, um Events zu speichern.")
      return
    }
    toggleSave(event._id)
  }

  const handleShare = async () => {
    const shareData = { title: event.title, url: window.location.href }

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
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-pressed={isSaved}
        aria-label={isSaved ? "Event gespeichert" : "Event speichern"}
        onClick={handleToggleSave}
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
      >
        <Bookmark className={cn("size-4 text-foreground", isSaved && "fill-primary text-primary")} />
      </button>
      <button
        type="button"
        aria-label="Event teilen"
        onClick={handleShare}
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
      >
        <Share2 className="size-4 text-foreground" />
      </button>
    </div>
  )
}

export default EventActions
