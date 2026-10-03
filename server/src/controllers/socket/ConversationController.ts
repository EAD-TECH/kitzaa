import { runAgent } from "../../agent/run.js";
import Conversation from "../../models/Conversation.js";
import { findOrCreateConversation } from "../../services/conversationService.js";
import { createSupportRoom } from "../../services/createSupportRoom.js";
import {
  getConversationHistory,
  SaveMessage,
} from "../../services/messageService.js";
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

  if (adminId === payload.targetId) return;

  const conversation = await findOrCreateConversation(
    adminId,
    payload.targetId,
  );

  /* admini odaya aldım */
  socket.join(conversation._id.toString());
  socket.emit("chat_session_ready", {
    conversationId: conversation._id,
    targetId: payload.targetId,
  });

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
  try {
    if (payload.roomId) {
      socket.join(payload.roomId);
    }

    const senderId = socket.data.userId;
    const senderType: MessageSenderType =
      socket.data.role === "admin" ? "admin" : "user";

    /* musterinin-adminin mesajini kaydettim */
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
        (socket.data.role === "admin" ? "Admin" : "Kullanıcı"),
      senderType: savedUserMessage.senderType,
      text: savedUserMessage.content,
      roomId: savedUserMessage.conversationId.toString(),
      timestamp: savedUserMessage.createdAt,
    };

    io.to(payload.roomId).emit("receive_message", frontendUserMessage);

    /* musteri mesajini gordu eger role user ise yapay zekayi cagiriyorm */
    if (socket.data.role === "user") {
      /* yapay zeka sadece support odada gorev alsın */
      const currentRoom = await Conversation.findById(payload.roomId);

      if (currentRoom && currentRoom.roomtype === "support") {
        /* ŞALTER BURADA: ajan aktifse ve admin henüz devralmadıysa */
        if (currentRoom.isAgentActive === true) {
          // 1. Önce tarihi çekiyoruz
          const history = await getConversationHistory(payload.roomId);

          // 2. Ajanı çalıştırıp tarihi veriyoruz
          const agentResponse = await runAgent(
            payload.text,
            payload.roomId,
            senderId,
            history,
          );

          /* Yapay zekanın ürettiği cevabı, kendi özel kimliğiyle DB'ye kaydet */
          const savedAiMessage = await SaveMessage(
            payload.roomId,
            "000000000000000000000000",
            "admin",
            agentResponse,
          );

          /* Yapay zekanın cevabını odaya fırlat */
          const frontendAiMessage = {
            id: savedAiMessage._id.toString(),
            senderId: "Kitzaa-ai",
            senderName: "Kitzaa Asistan",
            senderType: savedAiMessage.senderType,
            text: savedAiMessage.content,
            roomId: savedAiMessage.conversationId.toString(),
            timestamp: savedAiMessage.createdAt,
          };

          io.to(payload.roomId).emit("receive_message", frontendAiMessage);
          io.to(payload.roomId).emit(
            "receive_support_message",
            frontendAiMessage,
          );
        } else {
          console.log("Bu odada admin var, Yapay Zeka devre dısı.");
        }
      }
    }
  } catch (error) {
    console.error("Mesaj gönderilirken hata oluştu:", error);
  }
}; // <-- İŞTE EKSİK OLAN VE FONKSİYONU KAPATAN ANA PARANTEZ BURADA

export const handleSupportRequest = async (
  io: Server,
  socket: Socket,
  payload: any /* bu kısmı yazıcm sonra */,
) => {
  const userId = socket.data.userId;

  /* service klasorundekı fonk cagırıyorm ve userıd yı parametre olarak verıyorm */

  const supportRoom = await createSupportRoom(userId);
  const roomId = (supportRoom as any)._id.toString();

  /* musterıyı odayı aldım musterı odada beklıyor */

  socket.join(roomId);
  /* musterının mesajını db ye kaydet */

  const savedMessage = await SaveMessage(roomId, userId, "user", payload.text);

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

  /* io.to("admins_room").emit("new_activity", {
    id: `ticket_${Date.now()}`,
    title: " Yeni Destek Talebi",
    time: new Date().toISOString(),
    relatedId: (supportRoom as any)._id.toString(),
    type: "system-alert",
    isRead: false,
  });
 */
  /* bu noktadan sonra agentı devreye sokmam gerekıyor */

  if (socket.data.role === "admin") return;

  if (socket.data.role === "user") {
    try {
      const history = await getConversationHistory(roomId);
      const agentResponse = await runAgent(
        payload.text,
        roomId,
        userId,
        history,
      );

      const savedAiRespond = await SaveMessage(
        roomId,
        "000000000000000000000000",
        "admin",
        agentResponse,
      );
      io.to(roomId).emit("receive_support_message", {
        id: savedAiRespond._id.toString(),
        senderId: "Kitzaa-ai",
        senderName: "Kitzaa Asistan",
        senderType: savedAiRespond.senderType,
        text: savedAiRespond.content,
        roomId: savedAiRespond.conversationId.toString(),
        timestamp: savedAiRespond.createdAt,
      });
    } catch (error) {
      console.log("destek mesajinda agent hatasi", error);
      io.to(roomId).emit("receive_support_message", {
        id: `error_${Date.now()}`,
        senderId: "Kitzaa-ai",
        senderName: "Kitzaa Sistem",
        senderType: "admin",
        text: "Asistan sunucularımızda anlık bir yoğunluk var, sistem sizi yakında bir yetkiliye bağlayacaktır.",
        roomId,
        timestamp: new Date().toISOString(),
      });
    }
  }
};
