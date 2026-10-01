import cron from "node-cron";
import Event from "../models/eventModel.js";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import { Notification } from "../models/notificationModel.js";

dayjs.extend(utc);

export const sendOrganizerPrepSummary = async () => {
  /* yarının basını ve sonunu utc cınsınden buluyorm */
  const startOfTomorrow = dayjs().utc().add(1, "day").startOf("day").toDate();
  const endOfTomorrow = dayjs().utc().add(1, "day").endOf("day").toDate();
  console.log(
    "mongosa gıdecek olan aralık:",
    startOfTomorrow,
    "-",
    endOfTomorrow,
    "-",
  );
  /* gıdıp eventlarda yarınkı etkınlıklerı bulucm */
  const eventsTomorrow = await Event.find({
    status: "approved",
    "schedule.startDate": {
      $gte: startOfTomorrow, //yarının baslangıcından buyuk olan
      $lte: endOfTomorrow, //kucuk veya esit olan
    },
  });

  /* yarınkı etkınlıgı buldum.Organızatorlere tek bır event ıcın bıldırım paketi olusturcm hangı organızator hangı eventı yapıyorsa */

  const notificationToInsert = eventsTomorrow.map((event) => {
    /* confirmed olanların sayısını hesapla */

    const confirmedCount = (event.participants ?? []).filter(
      (participant) => participant.status === "confirmed",
    ).length;

    /*  organizatöre (createdBy) için bildirim objesini sayıyı donduruyorm */
    const message =
      confirmedCount === 0
        ? `Für deine morgige Veranstaltung '${event.title}' hat sich noch niemand angemeldet. Wir wünschen dir trotzdem einen großartigen Tag!`
        : `Für deine morgige Veranstaltung '${event.title}' sind aktuell ${confirmedCount} Familien angemeldet! Plane dein Material und deine Vorbereitung entsprechend.`;

    return {
      recipientId: event.createdBy,
      relatedId: event._id,
      relatedModel: "Event",
      title: "Vorbereitungs-Übersicht",
      message: message,
      type: "organizer_prep_summary",
    };
  });

  // Performans için veritabanına tek seferde bulk insert yapıyoruz
  const result = await Notification.insertMany(notificationToInsert);
  console.log(
    `Organizatör hazırlık bildirimi oluşturuldu: ${result.length} adet`,
  );
};

/* motoru olusturdm simdi onu tetiklemem lazim her gece 00:00 calısması ıcın*/
export const startEventForOrganizerReminderJob = () => {
  cron.schedule("0 0 * * *", sendOrganizerPrepSummary);
  // console.log("event reminder baslattım");
};
