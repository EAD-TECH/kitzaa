import { tool } from "ai";
import { z } from "zod";
import { getIO } from "../../sockets/socketManager.js";
import Conversation from "../../models/Conversation.js";
import User from "../../models/userModel.js";
import { sendBulknotificaitons } from "../../helpers/sendBulkNotifications.js";

export const transferToAdmin = tool({
  description:
    "Transfer the user to an administrator only for a submitted application whose status, approval, rejection, or processing is being asked about.",
  inputSchema: z.object({
    reason: z
      .string()
      .describe("A short reason for the administrator transfer."),
    roomId: z
      .string()
      .describe(
        "The exact room ID of the user provided in the system instructions.",
      ),
    userId: z
      .string()
      .describe("The exact user ID provided in the system instructions."),
  }),
  execute: async ({ reason, roomId, userId }) => {
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: roomId,
        participants: userId,
        roomtype: "support",
        status: { $ne: "closed" },
      },
      { $set: { status: "pending" } },
      { new: true },
    );

    if (!conversation) {
      throw new Error("Support room not found or user is not a participant.");
    }

    const admins = await User.find({ role: "admin" }).select("_id");
    await sendBulknotificaitons({
      userIdsArray: admins.map((admin) => admin._id),
      type: "system",
      title: "Neue Support-Anfrage",
      message: reason,
      relatedId: null,
      linkNotification: null,
    });

    const ticketId = `ticket_${Date.now()}`;

    getIO().to("admins_room").emit("new_activity", {
      id: ticketId,
      title: "Neue Support-Anfrage",
      description: reason,
      time: new Date().toISOString(),
      relatedId: roomId,
      userId,
      type: "system-alert",
      isRead: false,
    });

    return `Systemhinweis: Die Anfrage wurde wegen "${reason}" an das Team weitergegeben. Sag dem Nutzer nur, dass die Anfrage beim Team liegt und sich bald jemand meldet.`;
  },
});
