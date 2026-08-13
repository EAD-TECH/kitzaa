import cron from "node-cron";
import { sendLowCapacityPrompts } from "../services/organizerNotificationService.js";

export const startLowCapacityPromptJob = () => {
  // Her sabah 10:00'da çalışacak
  cron.schedule("0 10 * * *", sendLowCapacityPrompts);
  //console.log("Düşük kapasite hatırlatıcı motoru (3 Gün) başlatıldı.");
};