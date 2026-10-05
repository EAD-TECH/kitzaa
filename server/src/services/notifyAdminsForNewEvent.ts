import User from "../models/userModel.js";
import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import CustomError from "../helpers/customError.js";
import { slugify } from "../helpers/slugify.js";

export const notifyAdminsForNewEvent = async (
  applicantUsername: string,
  eventTitle: string, // institutionName yerine etkinlik başlığı
  eventId: any, // applicationId yerine etkinlik ID'si
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
  } catch (error: any) {
    console.error("Admin bildirimleri gönderilirken hata oluştu:", error);
    throw new CustomError(
      `Sistem Hatası: Bildirimler oluşturulamadı. (${error.message || "Bilinmeyen hata"})`,
      500,
    );
  }
};

export const notifyUserForApprovedEvent = async (
  userId: any,
  eventTitle: string,
  eventId: any,
  slug:string
) => {
  try {
    await sendBulknotificaitons({
      userIdsArray: [userId],
      type: "event_approved",
      title: "Etkinliğiniz Onaylandı! 🎉",
      message: `Tebrikler! "${eventTitle}" başlıklı etkinliğiniz Kitzaa tarafından uygun bulundu ve yayına alındı. Keyifli bir etkinlik geçirmeniz dileğiyle `,
      relatedId: eventId,
      relatedModel: "Event",
      linkNotification: `events/${slug}`,
    });

    /* console.log(
      `socket: Yapay zeka onay sinyali kullanıcıya (ID: ${userId}) fırlatıldı.`,
    ); */
  } catch (error: any) {
    console.error("AI Onay bildirimi gönderilirken hata oluştu:", error);
  }
};
