import cron from "node-cron";
import Event from "../models/eventModel.js";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import { Notification } from "../models/notificationModel.js";

dayjs.extend(utc);

export const sendRemindersForTomorrow = async () => {
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

  /* yarınkı etkinlikleten flatmap ile cnku nested event ıcınde participant once filtreledm confirmed olanları getırdı sonra maple gezerek herbirinin içine bu obje bildirim paketini insert edicem */

  const notificationToInsert = eventsTomorrow.flatMap((event) =>
    (event.participants ?? [])
      .filter((participant) => participant.status === "confirmed")
      .map((participant) => ({
        recipientId: participant.userId,
        relatedId: event._id,
        relatedModel: "Event",
        title: "Etkinlik Hatırlatıcısı",
        message: `Morgen beginnt Ihr Event '${event.title}'!`,
        type: "event_reminder",
      })),
  );
  /* event olayabilir */
  if (notificationToInsert.length === 0) return null;

  /* insertMany ıle bulk ınsert yap */
  const result = await Notification.insertMany(notificationToInsert);

  console.log("etkinlik hatırlatıcısı olusturuldu ve sayısı", result.length);
};

/* motoru olusturdm simdi onu tetiklemem lazim her gece 00:00 calısması ıcın*/
export const startEventReminderJob = () => {
  cron.schedule("0 0 * * *", sendRemindersForTomorrow);
  console.log("event reminder baslattım");
};
