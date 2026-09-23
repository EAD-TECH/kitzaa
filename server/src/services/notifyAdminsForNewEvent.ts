import User from "../models/userModel.js";
import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import CustomError from "../helpers/customError.js";

export const notifyAdminsForNewEvent = async (
  applicantUsername: string,
  eventTitle: string, // institutionName yerine etkinlik başlığı
  eventId: any,       // applicationId yerine etkinlik ID'si
) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");

    if (admins.length > 0) {
      const adminIds = admins.map((admin) => admin._id);

      await sendBulknotificaitons({
        userIdsArray: adminIds,
        type: "new_event",
        title: "Yeni Etkinlik Onayı", 
        message: `${applicantUsername} adlı kullanıcı "${eventTitle}" başlıklı onaya yeni bir etkinlik gönderdi.`,
        relatedId: eventId,
        relatedModel: "Event", 
        linkNotification: `/events?applicationId=${eventId}`, 
      });

      console.log(
        `socket: Yeni etkinlik sinyali ${adminIds.length} admine fırlatıldı.`,
      );
    }
  } catch (error:any) {
    console.error("Admin bildirimleri gönderilirken hata oluştu:", error);
    throw new CustomError(
      `Sistem Hatası: Bildirimler oluşturulamadı. (${error.message || "Bilinmeyen hata"})`, 
      500
    );
  }
};