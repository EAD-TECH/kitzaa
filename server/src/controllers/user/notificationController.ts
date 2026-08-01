import type { Request, Response } from "express";
import { Notification } from "../../models/notificationModel.js";
import { _discriminatedUnion } from "zod/v4/core";
import { toNotificationDTO } from "../../helpers/toNotificationDTO.js";

export const listNotificationsById = async (req: Request, res: Response) => {
  // 1. Sadece bu kullanıcıya ait olanları filtrele
  const customFilter: any = { recipientId: req.user._id };

  /* eger FE sadece ?isRead=false olanları derse customfıltera bunu eklıyorm   */
  if (req.query.isRead === "false") {
    customFilter.isRead = false;
  }

  // 3. Verileri getir (Kullanıcının filtresiyle)
  const notifications = await res.getModelList!(Notification, customFilter);

  // 4. Detayları getir (YİNE aynı filtreyle!)
  const details = await res.getModelListDetails!(Notification, customFilter);

  // 5. Cevabı dön
  res.status(200).json({
    success: true,
    details,
    notifications: toNotificationDTO(notifications),
  });
};

export const getUnReadNotificationCount = async (
  req: Request,
  res: Response,
) => {
  const unreadCount = await Notification.countDocuments({
    recipientId: req.user._id,
    isRead: false,
  });

  /* sayıyı dondum */
  res.status(200).json({
    success: true,
    data: { count: unreadCount },
  });
};

/* tek bıldırm okundu yapmak ısterse */

export const patchNotification = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const recipientId = req.user?._id;

  const updatedAsREadnotification = await Notification.findOneAndUpdate(
    { recipientId, _id: notificationId },
    { isRead: true },
    { new: true, runValidators: true },
  );

  if (!updatedAsREadnotification) {
    throw new Error("Notification couldnt found ");
  }
  return res.status(200).json({
    success: true,
    message: "Notification is read successfully",
    updatedAsREadnotification: toNotificationDTO(updatedAsREadnotification),
  });
};

/* kullanıcı eger tum bıldırımlerını okundu yapmak ısterse */

export const patchAllNotificationAsRead = async (
  req: Request,
  res: Response,
) => {
  /* Sadece okunmamış olanları hedefliyorum o yuzden fılterdan gecırıp false ları getırdım */
  const customFilter: any = { recipientId: req.user._id, isRead: false };

  const updatedAllnotifications = await Notification.updateMany(customFilter, {
    isRead: true,
  });

  return res.status(200).json({
    success: true,
    message: "All Notifications are read successfully",
    data: updatedAllnotifications.modifiedCount,
  });
};
