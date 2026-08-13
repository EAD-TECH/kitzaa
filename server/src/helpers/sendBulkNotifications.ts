import type { Types } from "mongoose";
import { Notification } from "../models/notificationModel.js";
import type { NotificationDocument } from "../types/notifications.types.js";
import { emitNotificationToUser } from "../sockets/emitNotification.js";
import { toNotificationDTO } from "./toNotificationDTO.js";

interface sendBulknotificaitonPayload {
  userIdsArray: Types.ObjectId[] | string[];
  type: string;
  title: string;
  message: string;
  relatedId: Types.ObjectId | string | null;
  relatedModel?:
    | "Event"
    | "OrganizerApplication"
    | "Post"
    | "PostComment"
    | null;
  linkNotification?: string | null;
}

export const sendBulknotificaitons = async ({
  userIdsArray,
  type,
  title,
  message,
  relatedId,
  relatedModel,
  linkNotification,
}: sendBulknotificaitonPayload) => {
  if (!userIdsArray || !userIdsArray.length) return null;

  try {
    /* bildirim pakeitini veritabanı formatına ceviriyorum */
    const notificationsToInsert = userIdsArray.map((userId) => ({
      recipientId: userId,
      relatedId: relatedId,
      relatedModel: relatedModel,
      type: type,
      title: title,
      message: message,
      linkNotification: linkNotification,
    }));

    const result = await Notification.insertMany(notificationsToInsert);

    console.log(
      `(Toplu Bildirim) ${result.length} adet bildirim başarıyla oluşturuldu.`,
    );

    for (const doc of result) {
      const dto = toNotificationDTO(doc as NotificationDocument);
      if (dto && !Array.isArray(dto)) {
        emitNotificationToUser(String(doc.recipientId), dto);
      }
    }

    return result;
  } catch (error) {
    console.log(
      "bıldırım olusurma sırasında olusan hatayı logla ve coz",
      error,
    );
  }
};
