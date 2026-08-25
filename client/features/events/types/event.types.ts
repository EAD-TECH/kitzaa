export type EventStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type EventLocationType = "indoor" | "outdoor" | "online";

export type AgeRange = "0-3" | "4-6" | "7-10" | "10-14" | "parents" | "all-ages";

export interface Price {
  amount: number;
  currency: string;
}

export interface Schedule {
  startDate: string;
  endDate?: string | null;
  startTime: string; // "14:00"
  endTime: string; // "17:00"
  isRecurring?: boolean;
  recurrenceRule?: string | null;
}

export interface EventLocation {
  venueName?: string | null;
  addressLine: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface Capacity {
  max: number;
  current: number;
}

// categoryId/createdBy sadece backend'in populate ettiği isteklerde zengin obje olarak döner,
// aksi halde düz id string'idir — hangisi geldiğini `typeof` ile ayırt et.
export interface EventCategoryRef {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface EventCreatedByRef {
  _id: string;
  username: string;
  avatarUrl: string | null;
  role: "user" | "organizer" | "admin";
}

export interface EventDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  images: string[];
  categoryId: string | EventCategoryRef;
  locationType: EventLocationType;
  ageRange: AgeRange;
  createdBy: string | EventCreatedByRef;
  status: EventStatus;
  isFree: boolean;
  price: Price | null;
  schedule: Schedule;
  location: EventLocation;
  capacity: Capacity;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// res.getModelListDetails'in döndüğü sayfalama bilgisi (server/src/middlewares/queryHandler.ts)
export interface ListDetails {
  count: number;
  filter: Record<string, unknown>;
  search: Record<string, unknown>;
  page: number;
  skip: number;
  limit: number;
  sort: Record<string, unknown>;
  pages:
    | false
    | {
        previous: number | false;
        current: number;
        next: number | false;
        total: number;
      };
}

// Backend'in tüm event endpoint'leri response'u bir zarfın içinde döner — apiFetch<EventDTO>
// diye çıplak DTO beklemek yanlış, her endpoint kendi zarf şeklini kullanmalı.
export interface EventListResponse {
  error: false;
  details: ListDetails;
  events: EventDTO[];
}

export interface NearbyEventsResponse {
  error: false;
  events: EventDTO[];
}

export interface EventResponse {
  error: false;
  event: EventDTO;
}

export interface EventLikeResponse {
  error: false;
  liked: boolean;
  event: EventDTO;
}

// GET /:id/participants -> participants.userId populate edilmişse zengin obje, edilmemişse id string'i
export interface EventParticipant {
  userId: string | { _id: string; username: string; avatarUrl: string | null };
  status: "confirmed" | "cancelled";
  joinedAt: string;
}

export interface EventParticipantsResponse {
  error: false;
  participants: EventParticipant[];
}
