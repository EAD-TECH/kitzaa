import { createNotification } from "../../helpers/createNotification.js";
import Conversation from "../../models/Conversation.js";
import { findOrCreateConversation } from "../../services/conversationService.js";
import { createSupportRoom } from "../../services/createSupportRoom.js";
import { SaveMessage } from "../../services/messageService.js";
import {
  processGuestSupportAgent,
  processSupportAgent,
} from "../../services/supportAgentService.js";
import type { ModelMessage } from "ai";
import type { MessageSenderType } from "../../types/messages.types.js";
import type { Socket, Server } from "socket.io";

interface ChatPayload {
  targetId: string;
}

export interface SendMessagePayload {
  roomId: string;
  text: string;
}

/* birebir chat olusturma */
export const handleChatSessionRequest = async (
  io: Server,
  socket: Socket,
  payload: ChatPayload,
) => {
  const adminId = socket.data.userId;

  if (adminId === payload.targetId) return;

  const conversation = await findOrCreateConversation(
    adminId,
    payload.targetId,
  );
  socket.join(conversation._id.toString());
  socket.emit("chat_session_ready", {
    conversationId: conversation._id,
    targetId: payload.targetId,
  });
  io.to(`user:${payload.targetId}`).emit("chat_invite", {
    roomId: conversation._id,
    adminId: socket.data.userId,
  });
};

/*
  Mesaj Gönderme (Direct ve Support Odaları)
  */
export const handleSendMessage = async (
  io: Server,
  socket: Socket,
  payload: SendMessagePayload,
) => {
  try {
    const senderId = socket.data.userId;
    const userRole = socket.data.role;

    if (userRole === "guest" && payload.roomId.startsWith("guest:")) {
      if (!payload.text?.trim()) return;
      socket.join(payload.roomId);
      io.to(payload.roomId).emit("receive_support_message", {
        id: `guest-user:${Date.now()}`,
        senderId,
        senderName: "Gast",
        senderType: "user",
        text: payload.text,
        roomId: payload.roomId,
        timestamp: new Date(),
      });
      const history = (socket.data.guestHistory ?? []) as ModelMessage[];
      const agentResponse = await processGuestSupportAgent(
        io,
        payload.roomId,
        payload.text,
        history,
      );
      socket.data.guestHistory = [
        ...history,
        { role: "user", content: payload.text },
        ...(agentResponse
          ? [{ role: "assistant" as const, content: agentResponse }]
          : []),
      ];
      return;
    }
   /*  */
    const room = await Conversation.findById(payload.roomId);
    if (!room || room.status === "closed") {
      socket.emit("error_message", { message: "Oda bulunamadı veya kapalı." });
      return;
    }

    const isParticipant = room.participants.some(
      (p) => p.toString() === senderId,
    );
    if (!isParticipant && userRole !== "admin") {
      socket.emit("error_message", { message: "Bu odaya erişim yetkiniz yok." });
      return;
    }

    socket.join(payload.roomId);

    const senderType: MessageSenderType = userRole === "admin" ? "admin" : "user";

    // --- Mesajı DB'ye Kaydet ---
    const savedUserMessage = await SaveMessage(
      payload.roomId,
      senderId,
      senderType,
      payload.text,
    );

    const frontendUserMessage = {
      id: savedUserMessage._id.toString(),
      senderId: senderId,
      senderName:
        socket.data.firstName ||
        (userRole === "admin" ? "Admin" : "Nutzer"),
      senderType: savedUserMessage.senderType,
      text: savedUserMessage.content,
      roomId: savedUserMessage.conversationId.toString(),
      timestamp: savedUserMessage.createdAt,
    };

    // --- EKSİK 2 DÜZELTİLDİ: ODA TİPİNE GÖRE SOCKET EVENT YAYINI ---
    if (room.roomtype === "support") {
      io.to(payload.roomId).emit("receive_support_message", frontendUserMessage);
    } else {
      io.to(payload.roomId).emit("receive_message", frontendUserMessage);
    }

    // --- Admin Mesajı ve Bildirim Mantığı ---
    if (userRole === "admin" && room.roomtype === "support") {
      const recipientId = room.participants[0];
      if (recipientId) {
        try {
          await createNotification(recipientId, "system", {
            title: "Antwort vom Support",
            message: payload.text,
            relatedId: room._id,
            senderId,
            linkNotification: `/?supportRoomId=${room._id.toString()}`,
          });
        } catch (error) {
          console.error("Destek bildirimi yazılamadı:", error);
        }
      }
    }

    // --- EKSİK 3 DÜZELTİLDİ: MERKEZİ AGENT SERVİSİ ÇAĞRISI ---
    if (userRole === "user" && room.roomtype === "support") {
      // Şalter, history ve runAgent mantığı artık tek merkezde
      await processSupportAgent(
        io,
        payload.roomId,
        senderId,
        payload.text,
        savedUserMessage._id.toString(),
      );
    }
  } catch (error) {
    console.error("Mesaj gönderilirken hata oluştu:", error);
  }
};

/**
  * 3. İlk Destek Talebi Oluşturma (Support Request)
  */
export const handleSupportRequest = async (
  io: Server,
  socket: Socket,
  payload: { text: string },
) => {
  try {
    const userId = socket.data.userId;

    if (socket.data.role === "guest") {
      if (!payload?.text || !payload.text.trim()) return;

      const roomId = `guest:${socket.id}`;
      socket.join(roomId);
      io.to(roomId).emit("receive_support_message", {
        id: `guest-user:${Date.now()}`,
        senderId: socket.data.userId,
        senderName: "Gast",
        senderType: "user",
        text: payload.text,
        roomId,
        timestamp: new Date(),
      });
      const history = (socket.data.guestHistory ?? []) as ModelMessage[];
      const agentResponse = await processGuestSupportAgent(
        io,
        roomId,
        payload.text,
        history,
      );
      socket.data.guestHistory = [
        ...history,
        { role: "user", content: payload.text },
        ...(agentResponse
          ? [{ role: "assistant" as const, content: agentResponse }]
          : []),
      ];
      return;
    }

    if (socket.data.role !== "user") {
      socket.emit("error_message", {
        message: "Sadece kullanıcılar destek talebi oluşturabilir.",
      });
      return;
    }

    if (!payload?.text || !payload.text.trim()) return;

    // Support Odasını Oluştur veya Aktif Olanı Getir
    const supportRoom = await createSupportRoom(userId);
    const roomId = (supportRoom as any)._id.toString();

    socket.join(roomId);

    // İlk Kullanıcı Mesajını Kaydet
    const savedMessage = await SaveMessage(roomId, userId, "user", payload.text);

    const frontendMessage = {
      id: savedMessage._id.toString(),
      senderId: userId,
      senderName: socket.data.firstName || "Nutzer",
      senderType: savedMessage.senderType,
      text: savedMessage.content,
      roomId: savedMessage.conversationId.toString(),
      timestamp: savedMessage.createdAt,
    };

    io.to(roomId).emit("receive_support_message", frontendMessage);

    // --- EKSİK 4 DÜZELTİLDİ: TEKRAR EDEN AGENT KODLARI KALDIRILDI ---
    await processSupportAgent(
      io,
      roomId,
      userId,
      payload.text,
      savedMessage._id.toString(),
    );
  } catch (error) {
    console.error("Destek talebi oluşturulurken hata oluştu:", error);
  }
};