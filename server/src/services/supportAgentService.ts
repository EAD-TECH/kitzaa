import Conversation from "../models/Conversation.js";
import { runAgent } from "../agent/run.js";
import { getConversationHistory, SaveMessage } from "./messageService.js";
import type { Server } from "socket.io";
import type { ModelMessage } from "ai";

const AI_SENDER = {
  senderId: "Kitzaa-ai",
  senderName: "Kitzaa Assistent",
  senderType: "ai" as const,
};

const emitAiMessage = (
  io: Server,
  roomId: string,
  id: string,
  text: string,
  timestamp: Date = new Date(),
) => {
  io.to(roomId).emit("receive_support_message", {
    id,
    ...AI_SENDER,
    text,
    roomId,
    timestamp,
  });
};

export const processSupportAgent = async (
  io: Server,
  roomId: string,
  userId: string,
  userMessageText: string,
  currentMessageId: string,
) => {
  try {
    const currentRoom = await Conversation.findById(roomId);

    if (!currentRoom || currentRoom.roomtype !== "support") {
      console.warn("[support] Oda bulunamadı veya support değil:", roomId);
      return;
    }

    // Admin devraldıysa AI susar (bilinçli davranış)
    if (currentRoom.isAgentActive !== true) {
      console.log(
        "[support] Agent kapalı / admin odada, AI cevap vermiyor:",
        roomId,
      );
      return;
    }

    const history = await getConversationHistory(roomId, currentMessageId);
    const agentResponse = await runAgent(
      userMessageText,
      roomId,
      userId,
      history,
    );

    const saved = await SaveMessage(roomId, null, "ai", agentResponse);
    emitAiMessage(
      io,
      roomId,
      saved._id.toString(),
      saved.content,
      saved.createdAt,
    );
  } catch (error) {
    console.error("[support] Destek agent hatası:", error);

    const fallbackText =
      "Der Assistent ist gerade nicht erreichbar. Eine Person aus dem Team meldet sich in Kürze.";

    try {
      const saved = await SaveMessage(roomId, null, "ai", fallbackText);
      emitAiMessage(
        io,
        roomId,
        saved._id.toString(),
        fallbackText,
        saved.createdAt,
      );
    } catch (saveError) {
      console.error("[support] Fallback mesajı kaydedilemedi:", saveError);
      emitAiMessage(io, roomId, `fallback:${Date.now()}`, fallbackText);
    }
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

    emitAiMessage(io, roomId, `guest-ai:${Date.now()}`, agentResponse);
    return agentResponse;
  } catch (error) {
    console.error("[guest] Gast-Agent konnte nicht antworten:", error);

    // error_message yerine client'ın dinlediği event ile gönder
    emitAiMessage(
      io,
      roomId,
      `guest-fallback:${Date.now()}`,
      "Der Assistent ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal oder logge dich ein.",
    );
    return null;
  }
};
