import type { NotificationDTO } from "../types/notifications.types.js";
import { getIO } from "./socketManager.js";

export const emitNotificationToUser = (
  recipientId: string,
  payload: NotificationDTO,
) => {
  try {
    getIO().to(`user:${recipientId}`).emit("notification:new", payload);
  } catch (error) {
    console.error("Socket emit failed:", error);
  }
};
