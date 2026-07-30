import type { Types } from "mongoose";
import { Notification } from "../models/notificationModel.js";
import type { NotificationType } from "../types/notifications.types.js";

/* fe gideck payload ıcerıgı */
interface NotificationPayload {
  title: string;
  message: string;
  linkNotification?: string | null;
  relatedId: Types.ObjectId | null;
}

export const createNotification = async (
  recipientId: Types.ObjectId,
  type: NotificationType,
  payload: NotificationPayload,
) => {
  try {
    const data = await Notification.create({
      recipientId,
      type,
      title: payload.title,
      message: payload.message,
      linkNotification: payload.linkNotification,
      relatedId: payload.relatedId,
    });

    console.log("bilgiyi gormem  lazım", data);
  } catch (error) {
    console.log(
      "bıldırım olusurma sırasında olusan hatayı logla ve coz",
      error,
    );
  }
};
