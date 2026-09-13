"use client"

import { useState } from "react"
import type { EventDTO } from "../../types/event.types"
import EventRegistrationCard from "./EventRegistrationCard"
import ParticipantAvatars from "./ParticipantAvatars"
import Veranstalter from "./Veranstalter"

interface EventDetailSidebarProps {
  event: EventDTO
  organizerCreatedBy: EventDTO["createdBy"]
  organizerEventCount: number
}

const EventDetailSidebar = ({ event: initialEvent, organizerCreatedBy, organizerEventCount }: EventDetailSidebarProps) => {
  const [event, setEvent] = useState(initialEvent)

  return (
    <>
      <EventRegistrationCard event={event} onEventChange={setEvent} />
      <Veranstalter createdBy={organizerCreatedBy} eventCount={organizerEventCount} />
      <ParticipantAvatars event={event} />
    </>
  )
}

export default EventDetailSidebar
