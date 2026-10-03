import CustomError from "../helpers/customError.js";
import Conversation from "../models/Conversation.js";
import type { ConversationDocument } from "../types/conversation.types.js";

export const findOrCreateConversation = async (
  adminId: string,
  targetId: string,
): Promise<ConversationDocument> => {
  /* targetId=adminid ise kendı kendıyle konusamasın */
  if (adminId === targetId) {
    throw new CustomError("admin kendı kendıyle konusam");
  }

  /* burda sadece direct ise oda tipi bu odaları bul */

  const existingConversation = await Conversation.findOne({
    participants: { $all: [adminId, targetId], $size: 2 },
    roomtype: "direct",
  });

  if (existingConversation) {
    return existingConversation;
  } else {
    return Conversation.create({
      participants: [adminId, targetId],
      roomtype: "direct",
    });
  }
};
