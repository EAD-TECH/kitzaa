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
  startTime: string;
  endTime: string;
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
    coordinates: [number, number];
  };
}

export interface Capacity {
  max: number;
  current: number;
}

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

export interface EventParticipantRef {
  _id: string;
  username: string;
  avatarUrl: string | null;
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
  participantsPreview: EventParticipantRef[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEventDTO extends Omit<EventDTO, "createdBy"> {
  createdBy: EventCreatedByRef | string;
  rejectedReason: string | null;
  cancelledReason: string | null;
  approvedAt: string | null;
}

export interface RejectEventBody {
  rejectedReason: string;
}

export interface CancelEventBody {
  cancelledReason: string;
}

export interface ListAdminEventsResponse {
  error: false;
  details: unknown;
  events: AdminEventDTO[];
}

export interface GetAdminEventResponse {
  error: false;
  event: AdminEventDTO;
}

export interface ApproveAdminEventResponse {
  error: false;
  event: AdminEventDTO;
}

export interface RejectAdminEventResponse {
  error: false;
  event: AdminEventDTO;
}

export interface CancelAdminEventResponse {
  error: false;
  event: AdminEventDTO;
}
