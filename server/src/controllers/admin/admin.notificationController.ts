import type { Request, Response } from "express";
import { Notification } from "../../models/notificationModel.js";
import { toAdminNotificationDTO } from "../../helpers/toNotificationDTO.js";

export const getAdminNotificationQueue = async (
  req: Request,
  res: Response,
) => {
  const customFilter: any = {
    type: { $in: ["organizer_application", "event_review"] },
  };

  if (req.query.isRead === "false") {
    customFilter.isRead = false;
  }
  //console.log("kontrol et filtreyi",customFilter)

  const notifications = await res.getModelList!(Notification, customFilter, [
    /* bildirimi yollayanın detayları */
    {
      path: "senderId",
      select: "username email avatarUrl",
    },

    /* etkink ve category detayı */

    {
      path: "relatedId",
      select: "title schedule categoryId",
      populate: {
        path: "categoryId",
        select: "name",
      },
    },
  ]);

  const details = await res.getModelListDetails!(Notification, customFilter);
  /*   const result = toAdminNotificationDTO(notifications); */
  //console.log("verinin sanitizasyonuna bak",result)

  res.status(200).json({
    success: true,
    details,
    notifications: toAdminNotificationDTO(notifications),
  });
};
