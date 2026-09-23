import { createNotification } from "../helpers/createNotification.js";
import CustomError from "../helpers/customError.js";
import type {
  NotificationDTO,
  NotificationType,
} from "../types/notifications.types.js";

export const notifyUserForEventStatus = async (
  userId: any,
  eventTitle: string,
  status: "approved" | "rejected" | "cancelled",
  eventId: any,
  reason?: string,
) => {
  try {
    let title = "";
    let message = "";

    let notificationType:
      | "event_approved"
      | "event_cancelled"
      | "event_rejected" = "event_approved";

    if (status === "approved") {
      title = "Etkinlik Onaylandı! 🎉";
      message = `Tebrikler! "${eventTitle}" başlıklı etkinliğiniz onaylandı ve yayına alındı.`;
      notificationType = "event_approved";
    } else if (status === "rejected") {
      title = "Etkinlik Reddedildi";

      message = `Maalesef "${eventTitle}" başlıklı etkinliğiniz reddedildi.${reason ? ` Sebep: ${reason}` : ""}`;
      notificationType = "event_rejected";
    } else if (status === "cancelled") {
      title = "Etkinlik İptal Edildi";

      message = `"${eventTitle}" başlıklı etkinliğiniz yöneticiler tarafından iptal edildi.${reason ? ` Sebep: ${reason}` : ""}`;
      notificationType = "event_cancelled";
    }

    await createNotification(userId, notificationType as NotificationType, {
      title: title,
      message: message,
      relatedId: eventId,
      relatedModel: "Event",
      linkNotification: `/profile/meine-events`,
    });
  } catch (error: any) {
    console.error(
      `Kullanıcıya ${status} bildirimi gönderilirken hata oluştu:`,
      error,
    );
    throw new CustomError(
      `Sistem Hatası: Bildirimler oluşturulamadı. (${error.message || "Bilinmeyen hata"})`,
      500,
    );
  }
};
