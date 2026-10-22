import { startEventReminderJob } from "./eventReminder.job.js";
import { startEventSummaryJob } from "./eventSummaryJob.js";
import { startLowCapacityPromptJob } from "./lowCapacityPromptJob.js";
import { startEventForOrganizerReminderJob } from "./organizerPrepJob.js";

export const initializeAllJobs = () => {

  startEventForOrganizerReminderJob();

  startEventReminderJob();
  startLowCapacityPromptJob()
  startEventSummaryJob()
};
