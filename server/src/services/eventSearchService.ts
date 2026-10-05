import Event from "../models/eventModel.js";
import type { EventDocument } from "../types/event.types.js";

const AI_EVENT_SEARCH_LIMIT = 20;

export const searchEvents = async (query: Record<string, unknown>): Promise<EventDocument[]> => {
  return await Event.find(query)
    .sort({ "schedule.startDate": 1 })
    .limit(AI_EVENT_SEARCH_LIMIT)
    .populate([
      { path: "categoryId", select: "name slug icon" },
      { path: "createdBy", select: "username avatarUrl role" },
    ]);
};
