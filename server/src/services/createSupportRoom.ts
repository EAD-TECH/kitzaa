import Conversation from "../models/Conversation.js";

export const createSupportRoom = async (userId: string): Promise<unknown> => {
  const supportRoom = await Conversation.create({
   participants: [userId],
    roomtype: "support",
    status: "pending",
  });
  return supportRoom
}; 
