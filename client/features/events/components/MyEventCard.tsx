"use client"

import { useState } from "react"

import type { EventDTO } from "../types/event.types"
import EventCard from "./EventCard"
import DeleteEventDialog from "./DeleteEventDialog"

interface MyEventCardProps {
  event: EventDTO
}

const MyEventCard = ({ event }: MyEventCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <>
      <EventCard event={event} variant="owner" onDelete={() => setIsDeleteOpen(true)} />
      <DeleteEventDialog
        eventId={event._id}
        eventTitle={event.title}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  )
}

export default MyEventCard
