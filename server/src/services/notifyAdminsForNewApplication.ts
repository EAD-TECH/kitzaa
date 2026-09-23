import User from "../models/userModel.js";
import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import CustomError from "../helpers/customError.js";

export const notifyAdminsForNewApplication = async (
  applicantUsername: string,
  institutionName: string,
  applicationId: any,
) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");

    if (admins.length > 0) {
      const adminIds = admins.map((admin) => admin._id);

      await sendBulknotificaitons({
        userIdsArray: adminIds,
        type: "organizer_application",
        title: "Yeni Organizatör Başvurusu",
        message: `${applicantUsername} adlı kullanıcı ${institutionName} kurumu için başvuru yaptı.`,
        relatedId: applicationId,
        relatedModel: "OrganizerApplication",
        linkNotification: `/organizer-applications?applicationId=${applicationId}`,
      });

      console.log(
        `socket: Yeni başvuru sinyali ${adminIds.length} admine fırlatıldı.`,
      );

      /* ekstra mail attırmak istersem adminlere bu satırlara yazılabilri */
    }
  } catch (error:any) {
    console.error("Admin bildirimleri gönderilirken hata oluştu:", error);
    throw new CustomError(
      `Sistem Hatası: Bildirimler oluşturulamadı. (${error.message || "Bilinmeyen hata"})`, 
      500
    );
  }
  
};
