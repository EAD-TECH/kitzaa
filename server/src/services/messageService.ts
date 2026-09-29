import Message from "../models/Message.js";
import type {
  MessageDocument,
  MessageSenderType,
} from "../types/messages.types.js";

export const SaveMessage = async (
  conversationId: string,
  senderId: string,
  senderType: MessageSenderType,
  content: string,
): Promise<MessageDocument> => {
  const newMessage = Message.create({
    conversationId,
    senderId,
    senderType,
    content,
    isRead: false,
  });

  return newMessage;
};
