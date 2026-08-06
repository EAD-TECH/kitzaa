import { startEventReminderJob } from "./eventReminder.job.js";
import { startEventForOrganizerReminderJob } from "./organizerPrepJob.js";

export const initializeAllJobs = () => {
  console.log("cron jobs motorumu burdan tetıklıyorm");

  startEventForOrganizerReminderJob();

  startEventReminderJob();
};
