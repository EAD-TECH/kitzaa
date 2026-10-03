import type { ModelMessage } from "ai";
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

export const getConversationHistory = async (
  conversationId: string,
): Promise<ModelMessage[]> => {
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(20);

  return messages.slice(0, -1).map((message) => ({
    role: message.senderType === "user" ? "user" : "assistant",
    content: message.content,
  }));
};
