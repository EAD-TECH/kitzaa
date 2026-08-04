import { sendBulknotificaitons } from "../helpers/sendBulkNotifications.js";
import User from "../models/userModel.js";

export const notifyUsersForNearbyEvent = async (event: any) => {
  const nearbyUsers = await User.find({
    "location.city": event.location.city,
    /* burda bir filtreleme yapıyorum */
    "notifications.email.newEvents": true,
  }).select("_id");

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
    linkNotification: `/events/${event._id}`,
  });
};
