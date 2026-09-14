"use client"

import { PartyPopper } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"
import EventListError from "@/features/events/components/EventListError"
import { MyEventCard } from "@/features/events/components/MyEventCard"
import { useMyEvents } from "@/features/events/hooks/useMyEvents"

const MeineEventsPage = () => {
  const { events, isLoading, isError } = useMyEvents()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-22 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <EventListError />
  }

  if (events.length === 0) {
    return (
      <ProfileEmptyState
        icon={PartyPopper}
        title="Noch keine Events erstellt"
        description="Deine selbst erstellten Events erscheinen hier, sobald du eines veröffentlichst."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => (
        <MyEventCard key={event._id} event={event} />
      ))}
    </div>
  )
}

export default MeineEventsPage
