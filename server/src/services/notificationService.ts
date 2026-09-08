import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import User from "../models/userModel.js";

export const notifyUsersForNearbyEvent = async (event: any) => {
  if (event.status !== "approved") return null;
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
    title: `Neue Veranstaltung in deiner Stadt: ${event.title}`,
    message: `In ${event.location.city} wurde eine neue Veranstaltung erstellt. Schau sie dir gleich an!`,
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
    title: `Abgesagt: ${event.title}`,
    // Eğer event objesinde bir iptal sebebi varsa onu kullan, yoksa standart mesaj ver
    message: event.cancelledReason
      ? `Wir bedauern, dir mitteilen zu müssen, dass die Veranstaltung abgesagt wurde. Grund: ${event.cancelledReason}`
      : `Wir bedauern, dir mitteilen zu müssen, dass die Veranstaltung "${event.title}" vom Organisator abgesagt wurde.`,
    relatedId: event._id,
    relatedModel: "Event",
    linkNotification: `/events/${event._id}`,
  });

  console.log("[KTZ-61] İptal bildirimleri başarıyla gönderildi!");
};
