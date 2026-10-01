
import cron from 'node-cron';
import Event from '../models/eventModel.js';

async function completePastEvents() {
  const now = new Date();

  const result = await Event.updateMany(
    {
      status: 'approved',
      $or: [
        { 'schedule.endDate': { $ne: null, $lt: now } },
        { 'schedule.endDate': null, 'schedule.startDate': { $lt: now } },
      ],
    },
    { status: 'completed' }
  );

  console.log(`[eventStatus.job] ${result.modifiedCount} event(s) marked as completed.`);
}

// Her gun gece yarisi (00:00) calisir.
export function startEventStatusJob() {
  cron.schedule('0 0 * * *', completePastEvents);
}
