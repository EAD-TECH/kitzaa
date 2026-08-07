import { startEventReminderJob } from "./eventReminder.job.js";
import { startLowCapacityPromptJob } from "./lowCapacityPromptJob.js";
import { startEventForOrganizerReminderJob } from "./organizerPrepJob.js";

export const initializeAllJobs = () => {
  console.log("cron jobs motorumu burdan tetıklıyorm");

  startEventForOrganizerReminderJob();

  startEventReminderJob();
  startLowCapacityPromptJob()
};
