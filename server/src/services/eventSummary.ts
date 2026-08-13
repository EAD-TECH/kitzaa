import Event from "../models/eventModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { Notification } from "../models/notificationModel.js";

dayjs.extend(utc);

export const sendPostEventSummaries = async () => {
  // GÜNCELLEME 5: Olası DB kopmalarına karşı tüm süreci Try-Catch zırhına aldık
  try {
    const now = dayjs.utc();

    // GÜNCELLEME 2: Esnek Zaman Penceresi (Dar ağ yerine, geniş ve güvenli ağ)
    // Alt Sınır: Üzerinden en az 2 saat geçmiş olmalı
    const twoHoursAgo = now.subtract(2, "hour").toDate();
    // Üst Sınır: Çok eskileri (aylar öncesini) taramasın diye 7 günlük makul bir limit (Lookback)
    const sevenDaysAgo = now.subtract(7, "day").toDate();

    console.log(
      "Post-Event Taraması:",
      sevenDaysAgo,
      "ile",
      twoHoursAgo,
      "arası",
    );

    const eventsToNotify = await Event.find({
      // GÜNCELLEME 1: Gece çalışan status motorunun "completed" yaptıklarını da yakala
      status: { $in: ["approved", "completed"] },

      // Anti-spam kalkanımız sabit (Bu sayede 7 günlük ağ kurabiliyoruz)
      systemNotificationSent: { $nin: ["post_event_summary"] },

      // GÜNCELLEME 4: endDate null olma ihtimaline karşı tutarlılık kalkanı ($or)
      $or: [
        {
          "schedule.endDate": { $lte: twoHoursAgo, $gte: sevenDaysAgo },
        },
        {
          "schedule.endDate": { $exists: false}, // Eğer endDate girilmemişse
          "schedule.startDate": { $lte: twoHoursAgo, $gte: sevenDaysAgo }, // Başlangıca göre hesapla
        },
      ],
    });

    if (!eventsToNotify.length) return null;

    const notificationToInsert = eventsToNotify.map((event) => {
      return {
        recipientId: event.createdBy,
        relatedId: event._id,
        relatedModel: "Event",
        title: "Etkinliğin nasıldı? 📸",
        message: `Umarız '${event.title}' etkinliğiniz harika geçmiştir! Deneyimini toplulukla paylaşmak ve diğer ailelere ilham olmak için etkinlikten birkaç anı fotoğrafı paylaşmaya ne dersin?`,
        type: "post_event_summary",
        linkNotification: `/share-event-photos/${event._id}`,
      };
    });

    // Bildirimleri gönder
    const result = await Notification.insertMany(notificationToInsert);
    console.log(
      `Etkinlik sonrası bildirimler oluşturuldu: ${result.length} adet`,
    );

      /* flag */
    const eventIds = eventsToNotify.map((event) => event._id);
    await Event.updateMany(
      { _id: { $in: eventIds } },
      { $addToSet: { systemNotificationSent: "post_event_summary" } },
    );

    console.log("Post-event Idempotency flagleri başarıyla eklendi.");
  } catch (error) {
    // Veritabanı çökerse veya insert çalışıp update çalışmazsa logla
    console.error("Post Event Summary motorunda kritik hata:", error);
  }
};
