
import type { EventDocument, EventDTO, AdminEventDTO, EventCategoryRef, EventCreatedByRef } from "../types/event.types.js";
import type { EventCategoryDocument } from "../types/eventCategory.types.js";
import type { UserDocument } from "../types/user.types.js";

// categoryId sadece populate edilmisse zengin obje olarak, aksi halde duz id string'i olarak doner.
// Referans verilen kategori silinmisse (dangling ref) populate sonucu null olur; bu durumda orijinal id'ye geri duser.
function toCategoryRef(event: EventDocument): string | EventCategoryRef {
  const populatedId = event.populated('categoryId');

  if (!populatedId) {
    return event.categoryId.toString();
  }

  const category = event.categoryId as unknown as EventCategoryDocument | null;

  if (!category) {
    return populatedId.toString();
  }

  return {
    _id: category._id!.toString(),
    name: category.name,
    slug: category.slug,
    icon: category.icon,
  };
}

// createdBy sadece populate edilmisse zengin obje olarak, aksi halde duz id string'i olarak doner.
// Referans verilen kullanici silinmisse (dangling ref) populate sonucu null olur; bu durumda orijinal id'ye geri duser.
function toCreatedByRef(event: EventDocument): string | EventCreatedByRef {
  const populatedId = event.populated('createdBy');

  if (!populatedId) {
    return event.createdBy.toString();
  }

  const user = event.createdBy as unknown as UserDocument | null;

  if (!user) {
    return populatedId.toString();
  }

  return {
    _id: user._id!.toString(),
    username: user.username,
    avatarUrl: user.avatarUrl ?? null,
    role: user.role,
  };
}

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
    categoryId: toCategoryRef(event),
    ageRange: event.ageRange,
    createdBy: toCreatedByRef(event),
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

// Admin variant: createdBy'in role bilgisiyle birlikte donmesi icin populate edilmis olmasini bekler
// (select: 'username avatarUrl role'), ayrica public DTO'da olmayan rejectedReason/approvedAt'i ekler.
export function toAdminEventDTO(event: EventDocument): AdminEventDTO;
export function toAdminEventDTO(event: EventDocument[]): AdminEventDTO[];
export function toAdminEventDTO(event: EventDocument | EventDocument[] | null): AdminEventDTO | AdminEventDTO[] | null;

export function toAdminEventDTO(event: EventDocument | EventDocument[] | null): AdminEventDTO | AdminEventDTO[] | null {
  if (!event) return null;

  if (Array.isArray(event)) {
    return event.map(item => toAdminEventDTO(item));
  }

  const createdBy = event.createdBy as unknown as UserDocument | null;
  const createdByPopulatedId = event.populated('createdBy');

  return {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    coverImage: event.coverImage ?? null,
    images: event.images ?? [],
    categoryId: toCategoryRef(event),
    ageRange: event.ageRange,
    createdBy: createdBy
      ? {
        _id: createdBy._id!.toString(),
        username: createdBy.username,
        avatarUrl: createdBy.avatarUrl ?? null,
        role: createdBy.role,
      }
      : (createdByPopulatedId ?? event.createdBy).toString(),
    status: event.status,
    rejectedReason: event.rejectedReason ?? null,
    cancelledReason: event.cancelledReason ?? null,
    approvedAt: event.approvedAt ?? null,
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
