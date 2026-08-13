import type { Types } from "mongoose";
import { Notification } from "../models/notificationModel.js";
import type {
  NotificationDocument,
  NotificationType,
} from "../types/notifications.types.js";
import { emitNotificationToUser } from "../sockets/emitNotification.js";
import { toNotificationDTO } from "./toNotificationDTO.js";

/* fe gideck payload ıcerıgı */
interface NotificationPayload {
  title: string;
  message: string;
  senderId?: Types.ObjectId | string | null;
  linkNotification?: string | null;
  relatedId: Types.ObjectId | null;
  relatedModel?:
    | "Event"
    | "OrganizerApplication"
    | "Post"
    | "PostComment"
    | null;
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
      senderId: payload.senderId ?? null,
      linkNotification: payload.linkNotification,
      relatedId: payload.relatedId,
      relatedModel: payload.relatedModel,
    });

    console.log("bilgiyi gormem  lazım", data);

    const dto = toNotificationDTO(data as NotificationDocument);
    if (dto && !Array.isArray(dto)) {
      emitNotificationToUser(String(recipientId), dto);
    }
  } catch (error) {
    console.log(
      "bıldırım olusurma sırasında olusan hatayı logla ve coz",
      error,
    );
  }
};
