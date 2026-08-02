import { email } from "zod";
import type {
  AdminNotificationDTO,
  NotificationDocument,
  NotificationDTO,
} from "../types/notifications.types.js";
import type { UserDocument } from "../types/user.types.js";
import type { EventDocument } from "../types/event.types.js";

/* asırı yükleme imzaları  tek bıldırım verırsen tek sonuc donerım*/

export function toNotificationDTO(
  notification: NotificationDocument,
): NotificationDTO;

/* bildirim listesi gelirse liste donulur */
export function toNotificationDTO(
  notification: NotificationDocument[],
): NotificationDTO[];

/* bos gelırse bos domulur */
export function toNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): NotificationDTO | NotificationDTO[] | null;

/* ana uygulama-Implementation */

export function toNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): NotificationDTO | NotificationDTO[] | null {
  /* defensive kod tanımla veri yoksa cokmesın sıstem */
  if (!notification) return null;

  /* liste seklınde gelıyse her elemanım bu fonksıyona gıtsın parametre olarak */

  if (Array.isArray(notification)) {
    return notification.map((not) => toNotificationDTO(not));
  }

  const senderData = notification.senderId as unknown as UserDocument | null;

  /* etkinliğin detayları relatedid dokumanı ıle eventdocument ustunden alıyorm */

  const eventData = notification.relatedId as unknown as EventDocument | null;

  /* eger tek bir obje gelirse  */

  return {
    _id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    relatedId: notification.relatedId
      ? notification.relatedId.toString()
      : null,
    linkNotification: notification.linkNotification ?? null,
    /*  IBaseDocument'ten gelen tarihler */
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
    /* bildirimin kıme aıt oldugunun detayı */
    sender: senderData
      ? {
          username: senderData.username,
          email: senderData.email,
          avatarUrl: senderData.avatarUrl ?? null,
        }
      : undefined,

    /* event detaylari */
    eventSummary: eventData
      ? {
          name: eventData.title,
          /* kategori populate se ismini al */
          category: (eventData.categoryId as unknown as any)?.name ?? "",
          date: eventData.schedule?.startDate,
        }
      : undefined,
  };
}

/* eger kısı admın ıse fe tarafına daha extent veri yollamak lazım */

export function toAdminNotificationDTO(
  notification: NotificationDocument,
): AdminNotificationDTO;

export function toAdminNotificationDTO(
  notifications: NotificationDocument[],
): AdminNotificationDTO[];

/* 2. Ana Uygulama (Implementation) - Sadece TEK bir gövde! */
export function toAdminNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): AdminNotificationDTO | AdminNotificationDTO[] | null {
  /* Defensive kod: veri yoksa sistemi koru */
  if (!notification) return null;

  if (Array.isArray(notification)) {
    return notification.map((not) => ({
      ...toNotificationDTO(not),
      recipientId: not.recipientId.toString(),
    }));
  }

  /* eger gelen verim tek obje ıse */

  return {
    ...toNotificationDTO(notification),
    recipientId: notification.recipientId.toString(),
  };
}
