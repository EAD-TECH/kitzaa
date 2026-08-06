import type {
  AdminNotificationDTO,
  NotificationDocument,
  NotificationDTO,
} from "../types/notifications.types.js";
import type { UserDocument } from "../types/user.types.js";
import type { EventDocument } from "../types/event.types.js";

/* Aşırı yükleme (overload) imzaları: Tek bildirim verirsen tek sonuç dönerim */
export function toNotificationDTO(
  notification: NotificationDocument,
): NotificationDTO;

/* Bildirim listesi gelirse liste dönülür */
export function toNotificationDTO(
  notification: NotificationDocument[],
): NotificationDTO[];

/* Boş gelirse boş dönülür */
export function toNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): NotificationDTO | NotificationDTO[] | null;

/* 1. Ana uygulama (Implementation) */
export function toNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): NotificationDTO | NotificationDTO[] | null {
  /* Defensive kod: veri yoksa sistem çökmesin */
  if (!notification) return null;

  /* Liste şeklinde geldiyse her eleman bu fonksiyona gitsin */
  if (Array.isArray(notification)) {
    // Tür dönüşümü garantisi veriyoruz (as NotificationDTO)
    return notification.map((not) => toNotificationDTO(not) as NotificationDTO);
  }

  const senderData = notification.senderId as unknown as UserDocument | null;

  let eventSummary = undefined;

  /* Yeni yaklaşım: Bildirimin type'ına değil, modelin ne olduğuna bakılacak */
  if (notification.relatedModel === "Event" && notification.relatedId) {
    const eventData = notification.relatedId as unknown as EventDocument;

    eventSummary = {
      name: eventData.title,
      category: (eventData.categoryId as unknown as any)?.name ?? "",
      date: eventData.schedule?.startDate,
    };
  }

  /* organizator ve diğer modellerim için bu işlemleri yapacağım (gelecekte eklenecek) */

  /* Eğer tek bir obje gelirse */
  return {
    _id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    relatedId: notification.relatedId
      ? notification.relatedId.toString()
      : undefined,

    linkNotification: notification.linkNotification ?? null,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,

    sender: senderData
      ? {
          username: senderData.username,
          email: senderData.email,
          avatarUrl: senderData.avatarUrl ?? "",
        }
      : undefined,

    eventSummary: eventSummary,
  };
}

/* Eğer kişi admin ise FE tarafına daha geniş (extended) veri yollamak lazım */
export function toAdminNotificationDTO(
  notification: NotificationDocument,
): AdminNotificationDTO;

export function toAdminNotificationDTO(
  notifications: NotificationDocument[],
): AdminNotificationDTO[];

/* toAdminNotificationDTO için de null imzasını ekliyoruz ki tutarlı olsun */
export function toAdminNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): AdminNotificationDTO | AdminNotificationDTO[] | null;

/* 2. Ana Uygulama (Implementation) - Sadece TEK bir gövde! */
export function toAdminNotificationDTO(
  notification: NotificationDocument | NotificationDocument[] | null,
): AdminNotificationDTO | AdminNotificationDTO[] | null {
  /* Defensive kod: veri yoksa sistemi koru */
  if (!notification) return null;

  if (Array.isArray(notification)) {
    return notification.map((not) => ({
      ...(toNotificationDTO(not) as NotificationDTO), // Spread ile genişletiyoruz
      recipientId: not.recipientId.toString(),
    }));
  }

  /* Eğer gelen verim tek obje ise */
  return {
    ...(toNotificationDTO(notification) as NotificationDTO),
    recipientId: notification.recipientId.toString(),
  };
}
