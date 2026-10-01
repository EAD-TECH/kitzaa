import type { Request, Response } from "express";
import { Notification } from "../../models/notificationModel.js";
import { toNotificationDTO } from "../../helpers/toNotificationDTO.js";
import CustomError from "../../helpers/customError.js";
import path from "node:path";
import { getOneMonthAgo } from "../../helpers/getOneMonthAgo.js";

export const listNotificationsById = async (req: Request, res: Response) => {
  // 1. Sadece bu kullanıcıya ait olanları filtrele
  const customFilter: any = {
    recipientId: req.user._id,
    createdAt: { $gte: getOneMonthAgo() },
  };

  /* eger FE sadece ?isRead=false olanları derse customfıltera bunu eklıyorm   */
  if (req.query.isRead === "false") {
    customFilter.isRead = false;
  }

  console.log("musterinin istediği filtre calısıyormu", customFilter);

  // 3. Verileri getir (Kullanıcının filtresiyle)
  const notifications = await res.getModelList!(Notification, customFilter, [
    { path: "senderId", select: "firstName lastName avatarUrl username email" },
  ]);

  /* burda veritabanından gelen kirli veri olması lazım */
  console.log(
    "burda veritabanından gelen kirli veri olması lazım",
    notifications,
  );

  // 4. Detayları getir (YİNE aynı filtreyle!)
  const details = await res.getModelListDetails!(Notification, customFilter);

  /* sanitize edilen veriyi gormek ıstıyorm */
  const result = toNotificationDTO(notifications);
  console.log("cleandata", result);

  // 5. Cevabı dön
  res.status(200).json({
    error: false,
    details,
    result,
  });
};

export const getUnReadNotificationCount = async (
  req: Request,
  res: Response,
) => {
  const unreadCount = await Notification.countDocuments({
    recipientId: req.user._id,
    isRead: false,
     createdAt: { $gte: getOneMonthAgo() },
  });
  console.log("okunmamısları getirmesi lazım", unreadCount);

  /* sayıyı dondum */
  res.status(200).json({
    error: false,
    data: { count: unreadCount },
  });
};

/* tek bıldırm okundu yapmak ısterse */

export const patchNotification = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const recipientId = req.user?._id;

  console.log(
    `İşlem Yapılan Bildirim ID: ${notificationId}, Kullanıcı: ${recipientId}`,
  );

  const updatedAsREadnotification = await Notification.findOneAndUpdate(
    { recipientId, _id: notificationId },
    { isRead: true },
    { new: true, runValidators: true },
  );

  console.log("veri sanitize edilmeden once", updatedAsREadnotification);

  if (!updatedAsREadnotification) {
    throw new CustomError("Notification not found ", 404);
  }
  const result = toNotificationDTO(updatedAsREadnotification);
  console.log("veri sanitize edildimi buna bakmam lazım", result);
  return res.status(200).json({
    error: false,
    message: "Notification is read successfully",
    result,
  });
};

/* kullanıcı eger tum bıldırımlerını okundu yapmak ısterse */

export const patchAllNotificationAsRead = async (
  req: Request,
  res: Response,
) => {
  /* Sadece okunmamış olanları hedefliyorum o yuzden fılterdan gecırıp false ları getırdım */
  const customFilter: any = { recipientId: req.user._id, isRead: false };
  console.log("toplu guncelleme", customFilter);

  const updatedAllnotifications = await Notification.updateMany(customFilter, {
    isRead: true,
  });
  console.log("guncelleme sonucu", updatedAllnotifications);

  return res.status(200).json({
    error: false,
    message: "All Notifications are read successfully",
    data: updatedAllnotifications.modifiedCount,
  });
};
