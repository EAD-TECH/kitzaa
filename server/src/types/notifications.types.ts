import type { ObjectId, Types, HydratedDocument } from "mongoose";

export type NotificationType =
  | "post_like"
  | "post_comment"
  | "new_event"
  | "event_reminder"
  | "event_cancelled"
  | "forum_reply"
  | "nearby_event"
  | "organizer_approved"
  | "organizer_application"
  | "event_review"
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
  message: string;
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
}
