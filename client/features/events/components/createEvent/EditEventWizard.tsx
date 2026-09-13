"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { getEventForEdit } from "../../api/eventApi"
import type { EventDTO } from "../../types/event.types"
import type { CreateEventFormInput } from "../../types/createEvent.types"
import type { EventCategoryDTO } from "../../types/eventCategory.types"
import { CreateEventWizard } from "./CreateEventWizard"

function eventToFormInput(event: EventDTO): CreateEventFormInput {
  return {
    title: event.title,
    description: event.description,
    coverImage: event.coverImage,
    images: event.images,
    categoryId: typeof event.categoryId === "string" ? event.categoryId : event.categoryId._id,
    locationType: event.locationType,
    ageRange: event.ageRange,
    isFree: event.isFree,
    price: event.price,
    schedule: {
      startDate: new Date(event.schedule.startDate),
      endDate: event.schedule.endDate ? new Date(event.schedule.endDate) : null,
      startTime: event.schedule.startTime,
      endTime: event.schedule.endTime,
      isRecurring: event.schedule.isRecurring ?? false,
      recurrenceRule: event.schedule.recurrenceRule ?? null,
    },
    location: {
      venueName: event.location.venueName ?? "",
      addressLine: event.location.addressLine,
      city: event.location.city,
      state: event.location.state ?? "",
      zipCode: event.location.zipCode ?? "",
      country: event.location.country,
      coordinates: {
        lat: event.location.coordinates.coordinates[1],
        lng: event.location.coordinates.coordinates[0],
      },
    },
    capacity: { max: event.capacity.max },
  }
}

interface EditEventWizardProps {
  eventId: string
  categories: EventCategoryDTO[]
}

export function EditEventWizard({ eventId, categories }: EditEventWizardProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", "edit", eventId],
    queryFn: () => getEventForEdit(eventId),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center py-24 text-center text-muted-foreground">
        <p>Event konnte nicht geladen werden.</p>
      </div>
    )
  }

  return (
    <CreateEventWizard
      categories={categories}
      mode="edit"
      eventId={eventId}
      defaultValues={eventToFormInput(data.event)}
    />
  )
}
