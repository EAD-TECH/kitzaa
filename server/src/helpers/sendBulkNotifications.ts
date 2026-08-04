import type { Types } from "mongoose";
import { Notification } from "../models/notificationModel.js";

interface sendBulknotificaitonPayload {
  userIdsArray: Types.ObjectId[] | string[];
  type: string;
  title: string;
  message: string;
  relatedId: Types.ObjectId | string | null;
  linkNotification?: string | null;
}

export const sendBulknotificaitons = async ({
  userIdsArray,
  type,
  title,
  message,
  relatedId,
  linkNotification,
}: sendBulknotificaitonPayload) => {
  if (!userIdsArray || !userIdsArray.length) return null;

  try {
    /* bildirim pakeitini veritabanı formatına ceviriyorum */
    const notificationsToInsert = userIdsArray.map((userId) => ({
      recipientId: userId,
      relatedId: relatedId,
      type: type,
      title: title,
      message: message,
      linkNotification: linkNotification,
    }));

    const result = await Notification.insertMany(notificationsToInsert);

    console.log(
      `(Toplu Bildirim) ${result.length} adet bildirim başarıyla oluşturuldu.`,
    );

    return result;
  } catch (error) {
    console.log(
      "bıldırım olusurma sırasında olusan hatayı logla ve coz",
      error,
    );
  }
};



