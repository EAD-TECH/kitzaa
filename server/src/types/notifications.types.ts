import type { Types } from "mongoose";

export type NotificationType =
  | "post_like"
  | "post_comment"
  | "new_event"
  | "event_reminder"
  | "event_cancelled"
  | "forum_reply"
  | "nearby_event"
  | "organizer_approved"
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
  relatedId?: string | null
  linkNotification?: string |null;

  message: string;
}
