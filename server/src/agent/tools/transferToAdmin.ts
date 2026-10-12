import { tool } from "ai";
import { z } from "zod";
import { getIO } from "../../sockets/socketManager.js"; 

export const transferToAdmin = tool({
  description:
    "Transfer users to an administrator when they report a pending event or request an administrator.",
  inputSchema: z.object({
    reason: z.string().describe("A short reason for the administrator transfer."),
    roomId: z.string().describe("The exact room ID of the user provided in the system instructions."),
    userId: z.string().describe("The exact user ID provided in the system instructions."),
  }),
  execute: async ({ reason, roomId, userId }) => {
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
