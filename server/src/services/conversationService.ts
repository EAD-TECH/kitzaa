import Conversation from "../models/Conversation.js";
import type { ConversationDocument } from "../types/conversation.types.js";

export const findOrCreateConversation = async (
  adminId: string,
  targetId: string,
): Promise<ConversationDocument> => {
  const existingConversation = await Conversation.findOne({
    participants: { $all: [adminId, targetId] },
  });

  if (existingConversation) {
    return existingConversation;
  } else {
    return Conversation.create({ participants: [adminId, targetId] });
  }
};
