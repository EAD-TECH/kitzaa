import Event from "../models/eventModel.js";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import { Notification } from "../models/notificationModel.js";

dayjs.extend(utc);

export const sendLowCapacityPrompts = async () => {
  /* burda esnek yapıyı yaklamak adına yarından ıtıbaren 3 gun olacak sekılde */
  const startOfTomorrow = dayjs().utc().add(1, "day").startOf("day").toDate();
  /* ust sınırm 3 gun sonu */
  const endOf3Days = dayjs().utc().add(3, "day").endOf("day").toDate();
  console.log(
    "MongoDB'ye gidecek 3 günlük aralık:",
    startOfTomorrow,
    "-",
    endOf3Days,
  );

  /* Eventı bul bu aralık ıcın DB den */

  const eventsToNotify = await Event.find({
    status: "approved",
    "schedule.startDate": {
      $gte: startOfTomorrow,
      $lte: endOf3Days,
    },
    /* current degeri max degerinden kucuk olanları getır */
    $expr: { $lt: ["$capacity.current", "$capacity.max"] },
    /* Anti-Spam Kalkanı: Dizinin içinde 'low_capacity_3day' YOKSA ($ne) getir! */
    systemNotificationSent: { $nin: ["low_capacity_3day"] },
  });

  if (!eventsToNotify.length) return null;

  /* sımdı map ile dolasıp bıldırım paketi hazırlıyorum */

  const notificationToInsert = eventsToNotify.map((event) => {
    /* yuzde yi hesapla */

    const percent = Number(
      Math.round((event.capacity.current / event.capacity.max) * 100),
    );
    /* bildirim paketini hazırla */

    const eventDate = dayjs.utc(event.schedule.startDate).startOf("day");
    const today = dayjs.utc().startOf("day");

    // diff bize 1, 2 veya 3 rakamını verecek
    const daysLeft = eventDate.diff(today, "day");
    return {
      recipientId: event.createdBy,
      relatedId: event._id,
      relatedModel: "Event",
      title: "Kapasiteni doldurmak ister misin ?",
      message: `Etkinliğe ${daysLeft} gün kaldı, ancak kontenjanının sadece %${percent} i doldu.Daha fazla kişiye ulaşmak için etkinliğini ana akışta (feed) toplulukla paylaşmak ister misin?`,
      type: "low_capacity_3day",
      linkNotification: `/share-event/${event._id}`,
    };
  });

  const result = await Notification.insertMany(notificationToInsert);
  console.log(`Düşük kapasite bildirimleri oluşturuldu: ${result.length} adet`);

  /* simdi spam olayına bakıyoruz */

  /* Burda mantık bıldırımlerı verıtabanına ben bu etkınlıklere bıldırım atttım damgaları vurucm kı bır daha bıldırm almasınlar alanlar */

  /* elimde evetlarımn tum detayları var ama ben sadece id ustunden guncelleme yapıcm */

  const eventIds = eventsToNotify.map((event) => event._id);

  /* event id lerden listemi yaptım */

  /* sonra Event modelıne gıdıp sana bu ıdl erı veriyorm tek seferde guncelle  */

  await Event.updateMany(
    { _id: { $in: eventIds } },
    { $addToSet: { systemNotificationSent: "low_capacity_3day" } },
  );

  console.log("spam flaglerini ekledm.");
};
