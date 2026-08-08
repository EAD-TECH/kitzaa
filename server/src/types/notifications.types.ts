import type { ObjectId, Types, HydratedDocument } from "mongoose";

export type NotificationType =
  | "post_like"
  | "post_comment"
  | "new_event"
  | "event_reminder"
  | "event_cancelled"
  | "post_reply"
  | "nearby_event"
  | "organizer_approved"
  | "organizer_application"
  | "event_review"
  | "organizer_prep_summary"
  | "post_event_summary"
  | "low_capacity_3day"
  | "system";

export interface IBaseDocument {
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends IBaseDocument {
  type: NotificationType;
  recipientId: Types.ObjectId;
  title: string;
  isRead: boolean;
  relatedId?: Types.ObjectId | null;
  linkNotification?: string | null;
  relatedModel?:
    | "Event"
    | "OrganizerApplication"
    | "Post"
    | "PostComment"
    | null;
  message: string;
  senderId?: Types.ObjectId | null;
}

export type NotificationDocument = HydratedDocument<INotification>;

export interface NotificationDTO extends IBaseDocument {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string | null;
  linkNotification?: string | null;
  /* senderın organizatorun bılgileri */
  sender?: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatarUrl: string;
  };
  /* eventın detayları */
  eventSummary?: {
    name: string;
    category: string;
    date: Date;
  };
}

/* tekrar aynı verılerı yazmak yerıne extend ıle normal userdan verilerimi extend ettim */
export interface AdminNotificationDTO extends NotificationDTO {
  recipientId: string;
}
