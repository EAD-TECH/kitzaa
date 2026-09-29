import { findOrCreateConversation } from "../../services/conversationService.js";
import { createSupportRoom } from "../../services/createSupportRoom.js";
import { SaveMessage } from "../../services/messageService.js";
import type { MessageSenderType } from "../../types/messages.types.js";
import type { Socket, Server } from "socket.io";

interface ChatPayload {
  targetId: string;
}

export interface SendMessagePayload {
  roomId: string;
  receiverId: string;
  text: string;
}

export const handleChatSessionRequest = async (
  io: Server,
  socket: Socket,
  payload: ChatPayload,
) => {
  const adminId = socket.data.userId;

  const conversation = await findOrCreateConversation(
    adminId,
    payload.targetId,
  );

  /* admini odaya aldım */
  socket.join(conversation._id.toString());
  socket.emit("chat_session_ready", { conversationId: conversation._id });

  /* admının yazdıgı kullanıcıyı bılgılendırıyorm */

  io.to(`user:${payload.targetId}`).emit("chat_invite", {
    roomId: conversation._id,
    adminId: socket.data.userId,
  });
};

export const handleSendMessage = async (
  io: Server,
  socket: Socket,
  payload: SendMessagePayload,
) => {
  console.log("admının merhaba yazsısı backende gelıyormu", payload);
  try {
    const senderId = socket.data.userId;
    const senderType: MessageSenderType =
      socket.data.role === "admin" ? "admin" : "user";

    const savedMessage = await SaveMessage(
      payload.roomId,
      senderId,
      senderType,
      payload.text,
    );

    const frontendMessage = {
      id: savedMessage._id.toString(),
      senderId: senderId,
      senderName: socket.data.firstName || "Admin",
      senderType: savedMessage.senderType,
      text: savedMessage.content,
      roomId: savedMessage.conversationId.toString(),
      timestamp: savedMessage.createdAt,
    };
    io.to(payload.roomId).emit("receive_message", frontendMessage);
  } catch (error) {
    console.log("mesaj gonderılırken alınan hata", error);
  }
};

export const handleSupportRequest = async (
  io: Server,
  socket: Socket,
  payload: any /* bu kısmı yazıcm sonra */,
) => {
  const userId = socket.data.userId;

  /* service klasorundekı fonk cagırıyorm ve userıd yı parametre olarak verıyorm */

  const supportRoom = await createSupportRoom(userId);

  /* musterıyı odayı aldım musterı odada beklıyor */

  socket.join((supportRoom as { _id: { toString(): string } })._id.toString());
  /* musterının mesajını db ye kaydet */

  const savedMessage = await SaveMessage(
    (supportRoom as any)._id.toString(),
    userId,
    "user",
    payload.text,
  );

  const frontendMessage = {
    id: savedMessage._id.toString(),
    senderId: userId,
    senderName: socket.data.firstName || "Kullanıcı",
    senderType: savedMessage.senderType,
    text: savedMessage.content,
    roomId: savedMessage.conversationId.toString(),
    timestamp: savedMessage.createdAt,
  };

  io.to((supportRoom as any)._id.toString()).emit(
    "receive_support_message",
    frontendMessage,
  );

  io.to("admins_room").emit("new_activity", {
    id: `ticket_${Date.now()}`,
    title: " Yeni Destek Talebi",
    time: new Date().toISOString(),
    relatedId: (supportRoom as any)._id.toString(),
    type: "system-alert",
    isRead: false,
  });
};
