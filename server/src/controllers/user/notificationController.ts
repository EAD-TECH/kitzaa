import type { Request, Response } from "express";
import { Notification } from "../../models/notificationModel.js";

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
    data: { payload: notifications },
  });
};
