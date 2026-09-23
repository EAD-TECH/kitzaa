import { createNotification } from "../helpers/createNotification.js";
import CustomError from "../helpers/customError.js";
import type { NotificationType } from "../types/notifications.types.js";

export const notifyUserForAppStatus = async (
  userId: any,
  institutionName: string,
  status: "approved" | "rejected",
  applicationId: any,
  reason?: string,
) => {
  try {
    let title = "";
    let message = "";
    let notificationType: "organizer_approved" | "organizer_rejected" =
      "organizer_approved";

    if (status === "approved") {
      title = "Organizatör Başvurusu Onaylandı! 🎉";
      message = `Tebrikler! "${institutionName}" kurumu için yaptığınız organizatör başvurusu onaylandı.`;
      notificationType = "organizer_approved";
    } else if (status === "rejected") {
      title = "Organizatör Başvurusu Reddedildi";
      message = `Maalesef "${institutionName}" kurumu için yaptığınız başvuru reddedildi.${reason ? ` Sebep: ${reason}` : ""}`;
      notificationType = "organizer_rejected";
    }

    await createNotification(userId, notificationType as NotificationType, {
      title,
      message,
      relatedId: applicationId,
      relatedModel: "OrganizerApplication",
      linkNotification: "/profile",
    });
  } catch (error:any) {
    console.error(
      `Kullanıcıya ${status} bildirimi gönderilirken hata oluştu:`,
      error,
    );
     throw new CustomError(
      `Sistem Hatası: Bildirimler oluşturulamadı. (${error.message || "Bilinmeyen hata"})`, 
      500
    );
  }
};
