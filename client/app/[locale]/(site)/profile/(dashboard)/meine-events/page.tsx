"use client"

import { PartyPopper } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"
import MyEventCard from "@/features/events/components/MyEventCard"
import EventListSkeleton from "@/features/events/components/EventListSkeleton"
import EventListError from "@/features/events/components/EventListError"
import { useMyEvents } from "@/features/events/hooks/useMyEvents"

const EVENT_GRID_CLASSNAME =
  "grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0"

const MeineEventsPage = () => {
  const { events, isLoading, isError } = useMyEvents()

  if (isLoading) {
    return <EventListSkeleton />
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
    <div className={EVENT_GRID_CLASSNAME}>
      {events.map((event) => (
        <MyEventCard key={event._id} event={event} />
      ))}
    </div>
  )
}

export default MeineEventsPage
