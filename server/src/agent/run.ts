import { groq } from "@ai-sdk/groq";
import { generateText, stepCountIs, type ModelMessage } from "ai";
import { filterCompatibleMessages } from "./system/filterMessages.js";
import { SYSTEM_PROMPT } from "./system/prompt.js";
import { tools } from "./tools/index.js";
import type { AgentCallbacks } from "./types.js";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

export const runAgent = async (
  userMessage: string,
  roomId: string,
  userId: string, 
  conversationHistory: ModelMessage[] = [],
  callbacks: AgentCallbacks = {}, 
): Promise<string> => {
  callbacks.onStart?.();

  try {
    const dynamicSystemPrompt = `${SYSTEM_PROMPT}\n\nWICHTIG: Die Raum-ID dieses Nutzers (roomId) ist "${roomId}". Die Nutzer-ID (userId) ist "${userId}". Wenn du transferToAdmin aufrufst, musst du genau diese Werte als roomId und userId senden.`;

    /* system ai a ozel olan prompt onun ogrenmesı gereken ben socket mimamrisi kullandıgm ıcın dınamık hale getırdm userid ve roomid degerleri sureklı degısken olucagndan dolayı */
    const { text } = await generateText({
      model: groq(DEFAULT_MODEL),
      system: dynamicSystemPrompt,
      messages: [
        ...filterCompatibleMessages(conversationHistory),
        { role: "user", content: userMessage },
      ],
      tools,
      stopWhen: stepCountIs(5),
    });

    const reply = text.trim()
      ? text
      : "Mesajını aldım. Bir yetkili bu sohbete kısa süre içinde bağlanacak.";

    callbacks.onComplete?.(reply);
    return reply;
  } catch (error) {
    callbacks.onError?.(error);
    throw error;
  }
};
