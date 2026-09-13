"use client"

import { Bookmark } from "lucide-react"

import ProfileEmptyState from "@/features/profile/components/ProfileEmptyState"
import EventCard from "@/features/events/components/EventCard"
import EventListSkeleton from "@/features/events/components/EventListSkeleton"
import EventListError from "@/features/events/components/EventListError"
import { useSavedEvents } from "@/features/events/hooks/useSavedEvents"

const EVENT_GRID_CLASSNAME =
  "grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 desktop:gap-16 mx-auto justify-center desktop:justify-start desktop:mx-0"

const GespeicherteEventsPage = () => {
  const { events, isLoading, isError } = useSavedEvents()

  if (isLoading) {
    return <EventListSkeleton />
  }

  if (isError) {
    return <EventListError />
  }

  if (events.length === 0) {
    return (
      <ProfileEmptyState
        icon={Bookmark}
        title="Noch keine gespeicherten Events"
        description="Events, die du mit dem Merken-Symbol speicherst, erscheinen hier."
      />
    )
  }

  return (
    <div className={EVENT_GRID_CLASSNAME}>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  )
}

export default GespeicherteEventsPage
