import Conversation from "../models/Conversation.js";
import { runAgent } from "../agent/run.js";
import { getConversationHistory, SaveMessage } from "./messageService.js";
import type { Server } from "socket.io";
import type { ModelMessage } from "ai";

export const processSupportAgent = async (
  io: Server,
  roomId: string,
  userId: string,
  userMessageText: string,
  currentMessageId: string
) => {
  try {
    // 1. Oda ve Agent Durum Kontrolü
    const currentRoom = await Conversation.findById(roomId);
    if (!currentRoom || currentRoom.roomtype !== "support") return;
    
    // Şalter inmişse (admin devralmışsa) AI kesinlikle susar
    if (currentRoom.isAgentActive !== true) {
      console.log("Bu odada admin var veya agent kapalı, Yapay Zeka devre dışı.");
      return;
    }

    const history = await getConversationHistory(roomId, currentMessageId);

    
    const agentResponse = await runAgent(
      userMessageText,
      roomId,
      userId,
      history,
    );

    // 4. AI Cevabını DB'ye Kaydetme
    const savedAiMessage = await SaveMessage(
      roomId,
      null,
      "ai",
      agentResponse,
    );

    // 5. Socket ile Tek Bir Event Üzerinden Yayınlama (Duplicate event önlendi)
    const frontendAiMessage = {
      id: savedAiMessage._id.toString(),
      senderId: "Kitzaa-ai",
      senderName: "Kitzaa Assistent",
      senderType: savedAiMessage.senderType,
      text: savedAiMessage.content,
      roomId: savedAiMessage.conversationId.toString(),
      timestamp: savedAiMessage.createdAt,
    };

    io.to(roomId).emit("receive_support_message", frontendAiMessage);

  } catch (error) {
    console.error("Destek agent hatası:", error);
    
    // Fault Tolerance (Faz 1/2 gereği fallback mesajı artık DB'ye de yazılıyor)
    const fallbackText = "Der Assistent ist gerade nicht erreichbar. Eine Person aus dem Team meldet sich in Kürze.";
    
    const savedFallback = await SaveMessage(
      roomId,
      null,
      "ai",
      fallbackText
    );

    io.to(roomId).emit("receive_support_message", {
      id: savedFallback._id.toString(),
      senderId: "Kitzaa-ai",
      senderName: "Kitzaa Assistent",
      senderType: "ai",
      text: fallbackText,
      roomId,
      timestamp: savedFallback.createdAt,
    });
  }
};

export const processGuestSupportAgent = async (
  io: Server,
  roomId: string,
  userMessageText: string,
  conversationHistory: ModelMessage[] = [],
) => {
  try {
    const agentResponse = await runAgent(
      userMessageText,
      roomId,
      roomId,
      conversationHistory,
      {},
      { enableAdminTools: false },
    );

    io.to(roomId).emit("receive_support_message", {
      id: `guest-ai:${Date.now()}`,
      senderId: "Kitzaa-ai",
      senderName: "Kitzaa Assistent",
      senderType: "ai",
      text: agentResponse,
      roomId,
      timestamp: new Date(),
    });
    return agentResponse;
  } catch (error) {
    console.error("Gast-Agent konnte nicht antworten:", error);
    io.to(roomId).emit("error_message", {
      message: "Der Assistent ist momentan nicht verfügbar.",
    });
    return null;
  }
};