import type { NextFunction, Request, Response } from "express";

import Event from "../../models/eventModel.js";
import dayjs from "dayjs";
import { toDashboardSummaryDTO } from "../../helpers/toDashboardSummaryDTO.js";
import Organizer from "../../models/organizerApplicationModel.js";

const adminDashboardController = {
  summary: async (req: Request, res: Response) => {
    const months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
    }

    const trendStart = dayjs().subtract(11, "month").startOf("month").toDate();

    const [
      eventTrends,
      totalEvents,
      pendingEventApprovals,
      pendingOrganizerApprovals,
      participantTrends,
      participantTotals,
    ] = await Promise.all([
        /* etkinlik trendi */

        Event.aggregate([
          {
            $set: {
              normalizedCreatedAt: {
                $convert: {
                  input: "$createdAt",
                  to: "date",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
          { $match: { normalizedCreatedAt: { $gte: trendStart } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$normalizedCreatedAt",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Event.countDocuments(),

        Event.countDocuments({ status: "pending" }),
        
        Organizer.countDocuments({ status: "pending" }),

        Event.aggregate([
          { $unwind: "$participants" },
          {
            $set: {
              normalizedJoinedAt: {
                $convert: {
                  input: "$participants.joinedAt",
                  to: "date",
                  onError: null,
                  onNull: null,
                },
              },
              normalizedParticipantCount: {
                $convert: {
                  input: "$participants.participantCount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
          {
            $match: {
              "participants.status": "confirmed",
              normalizedJoinedAt: { $gte: trendStart },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$normalizedJoinedAt",
                },
              },
              count: { $sum: "$normalizedParticipantCount" },
            },
          },
        ]),
        Event.aggregate([
          { $unwind: "$participants" },
          {
            $set: {
              normalizedParticipantCount: {
                $convert: {
                  input: "$participants.participantCount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
          { $match: { "participants.status": "confirmed" } },
          {
            $group: {
              _id: null,
              count: { $sum: "$normalizedParticipantCount" },
            },
          },
        ]),
      ]);
    const pendingApprovals = pendingEventApprovals + pendingOrganizerApprovals;
    const totalParticipants = participantTotals[0]?.count ?? 0;

    res.status(200).send({
      error: false,
      summary: toDashboardSummaryDTO({
        pendingApprovals,
        totalEvents,
        totalParticipants,
        eventTrends: eventTrends,
        participantTrends,
        months: months,
      }),
    });
  },
};

export default adminDashboardController;
