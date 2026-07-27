
import type { Types, Model, HydratedDocument } from 'mongoose';

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface IAgeRange {
  min: number;
  max: number;
}

export interface IPrice {
  amount: number;
  currency: string;
}

export interface ISchedule {
  startDate: Date;
  endDate?: Date | null;
  startTime: string; // "14:00"
  endTime: string; // "17:00"
  isRecurring?: boolean;  // tkrarlanan mi
  recurrenceRule?: string | null; // örn. "weekly", "monthly"
}

export interface IEventLocation {
  venueName?: string | null; // mekan adi
  addressLine: string;
  city: string; // sehir
  state?: string | null; //eyalet
  zipCode?: string | null;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
}

export interface ICapacity {
  max: number;
  current: number;
}

export interface IParticipant {
  userId: Types.ObjectId;
  status: 'confirmed' | 'cancelled';
  joinedAt: Date;
}


export interface IEvent {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  coverImage?: string | null;
  images?: string[];
  categoryId: Types.ObjectId;
  ageRange: IAgeRange;
  createdBy: Types.ObjectId;
  status: EventStatus;
  rejectedReason?: string | null;
  approvedAt?: Date | null;
  isFree: boolean;
  price?: IPrice | null;
  schedule: ISchedule;
  location: IEventLocation;
  capacity: ICapacity;
  participants?: IParticipant[];
  likes?: Types.ObjectId[];
  viewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventModel = Model<IEvent>;
export type EventDocument = HydratedDocument<IEvent>;

// categoryId/createdBy populate edilmisse zengin ref objesi, edilmemisse duz id string'i olarak doner.
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
  ageRange: IAgeRange;
  createdBy: string | EventCreatedByRef;
  status: EventStatus;
  isFree: boolean;
  price: IPrice | null;
  schedule: ISchedule;
  location: IEventLocation;
  capacity: ICapacity;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// omit createdBy haric tum alanlari al demek ve yazilanlari ekle
export interface AdminEventDTO extends Omit<EventDTO, 'createdBy'> {
  createdBy: EventCreatedByRef & { role: 'user' | 'organizer' | 'admin' };
  rejectedReason: string | null;
  approvedAt: Date | null;
}