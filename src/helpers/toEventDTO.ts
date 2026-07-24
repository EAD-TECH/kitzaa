
import type { EventDocument, EventDTO } from "../types/event.types.js";

// Function overloads
export function toEventDTO(event: EventDocument): EventDTO;
export function toEventDTO(event: EventDocument[]): EventDTO[];
export function toEventDTO(event: EventDocument | EventDocument[] | null): EventDTO | EventDTO[] | null;

// Implementation
export function toEventDTO(event: EventDocument | EventDocument[] | null): EventDTO | EventDTO[] | null {
  if (!event) return null;

  if (Array.isArray(event)) {
    return event.map(item => toEventDTO(item));
  }

  return {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    coverImage: event.coverImage ?? null,
    images: event.images ?? [],
    categoryId: event.categoryId.toString(),
    ageRange: event.ageRange,
    createdBy: event.createdBy.toString(),
    status: event.status,
    isFree: event.isFree,
    price: event.price ?? null,
    schedule: event.schedule,
    location: event.location,
    capacity: event.capacity,
    viewCount: event.viewCount,
    createdAt: event.createdAt!,
    updatedAt: event.updatedAt!,
  };
}
