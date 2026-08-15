export type EventStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface AgeRange {
  min: number;
  max: number;
}

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
}

export interface EventDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  images: string[];
  categoryId: string | EventCategoryRef;
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
