import { Schema, model, Types } from "mongoose";
import type {
  INotification,
  NotificationType,
} from "../types/notifications.types.js";

const NOTFICATION_TYPES: NotificationType[] = [
  "post_like",
  "post_comment",
  "new_event",
  "event_reminder",
  "event_cancelled",
  "post_reply",
  "nearby_event",
  "organizer_approved",
  "organizer_application",
  "event_review",
  "organizer_prep_summary",
  "low_capacity_3day",
  "post_event_summary",
  "system",
];

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: NOTFICATION_TYPES,
      required: true,
    },

    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      default: null,
      trim: true,
      refPath: "relatedModel" /* tabloyu bu alandan alack */,
    },

    relatedModel: {
      type: String,
      enum: [
        "Event",
        "OrganizerApplication",
        "Post",
        "PostComment",
      ] /* modellerim */,
      default: null,
    },
    linkNotification: {
      type: String,
      default: null,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  { timestamps: true },
);

/* bilesik indeksme olayi bu sayede recipientId + createdAt sorgularında filtreleme acisindan veya   sadece recipientId içeren sorgularında kullanilabilir*/
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
