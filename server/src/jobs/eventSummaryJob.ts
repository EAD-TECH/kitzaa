import cron from "node-cron";
import { sendPostEventSummaries } from "../services/eventSummary.js";

export const startEventSummaryJob = () => {
 /* her saat bası calısacak */
  cron.schedule("0 * * * *", sendPostEventSummaries);
}