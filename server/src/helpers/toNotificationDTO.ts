import type {
  AdminNotificationDTO,
  NotificationDocument,
  NotificationDTO,
} from "../types/notifications.types.js";

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
      recipientId: not.recipientId.toHexString(),
    }));
  }

  /* eger gelen verim tek obje ıse */

  return {
    ...toAdminNotificationDTO(notification),
    recipientId: notification.recipientId.toString(),
  };
}
