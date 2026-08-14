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
  | "post_mention"
  | "system";

/** Matches backend toNotificationDTO (JSON wire format). */
export interface NotificationDTO {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string | null;
  linkNotification?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatarUrl: string;
  };
  eventSummary?: {
    name: string;
    category: string;
    date: string;
  };
}

/** GET /notifications */
export interface ListNotificationsResponse {
  error: false;
  details: unknown;
  result: NotificationDTO[];
}

/** GET /notifications/unread-count */
export interface UnreadCountResponse {
  error: false;
  data: { count: number };
}

/** PATCH /notifications/:id */
export interface MarkNotificationReadResponse {
  error: false;
  message: string;
  result: NotificationDTO;
}

/** PATCH /notifications/mark-all-read */
export interface MarkAllNotificationsReadResponse {
  error: false;
  message: string;
  data: number;
}
