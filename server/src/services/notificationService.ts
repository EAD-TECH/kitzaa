import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import User from "../models/userModel.js";

export const notifyUsersForNearbyEvent = async (event: any) => {
  console.log(
    "[KTZ-58] Yakın çevre bildirim motoru tetiklendi. Şehir:",
    event.location.city,
  );

  const nearbyUsers = await User.find({
    "location.city": event.location.city,
    /* burda bir filtreleme yapıyorum */
    "notifications.email.newEvents": true,
  }).select("_id");
  console.log(
    ` [KTZ-58] Bulunan uygun kullanıcı sayısı: ${nearbyUsers.length}`,
  );

  /* defansiv kalkanm kımse yoksa cokmesın */

  if (!nearbyUsers.length) return null;

  /* bulk oncesi id lerimi diziye alıyorm */

  const userIds = nearbyUsers.map((user) => user._id);

  /* olusturdugm helperdakı bulk ıslemını yapan motorumu yanı sendBulknotificaitons fonksyonumu cagırp calıstırıyrm */

  await sendBulknotificaitons({
    userIdsArray: userIds,
    type: "nearby_event",
    title: `Şehrinizde Yeni Etkinlik: ${event.title}`,
    message: `${event.location.city} şehrinde yeni bir etkinlik oluşturuldu. Hemen inceleyin!`,
    relatedId: event._id,
    relatedModel: "Event",
    linkNotification: `/events/${event._id}`,
  });
  console.log("[KTZ-58] Yakın çevre bildirimleri başarıyla gönderildi!");
};

export const notifyUsersForCancelledEvent = async (event: any) => {
  console.log(
    " [KTZ-61] İptal bildirim motoru tetiklendi. Etkinlik:",
    event.title,
  );
  console.log(
    `[KTZ-61] Etkinlikteki toplam katılımcı sayısı: ${event.participants?.length || 0}`,
  );
  if (!event.participants || !event.participants.length) return null;

  const userIds = event.participants.map(
    (participant: any) => participant.userId,
  );

  await sendBulknotificaitons({
    userIdsArray: userIds,
    type: "event_cancelled",
    title: `Cancel edilmiştir: ${event.title}`,
    // Eğer event objesinde bir iptal sebebi varsa onu kullan, yoksa standart mesaj ver
    message: event.cancelledReason
      ? `Üzülerek bildiririz ki etkinlik iptal edilmiştir. Sebep: ${event.cancelledReason}`
      : `Üzülerek bildiririz ki "${event.title}" adlı etkinlik organizatör tarafından iptal edilmiştir.`,
    relatedId: event._id,
    relatedModel: "Event",
    linkNotification: `/events/${event._id}`,
  });

  console.log("[KTZ-61] İptal bildirimleri başarıyla gönderildi!");
};
