import { groq } from "@ai-sdk/groq";
import { generateText, stepCountIs, type ModelMessage } from "ai";
import { Laminar } from "@lmnr-ai/lmnr";
import { filterCompatibleMessages } from "./system/filterMessages.js";
import { SYSTEM_PROMPT } from "./system/prompt.js";
import { tools } from "./tools/index.js";
import type { AgentCallbacks } from "./types.js";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

Laminar.initialize({
  projectApiKey: process.env.LMNR_API_KEY,
});

export const runAgent = async (
  userMessage: string,
  roomId: string,
  userId: string,
  conversationHistory: ModelMessage[] = [],
  callbacks: AgentCallbacks = {},
  options: { enableAdminTools?: boolean } = {},
): Promise<string> => {
  callbacks.onStart?.();

  try {
    const enableAdminTools = options.enableAdminTools !== false;
    const dynamicSystemPrompt = enableAdminTools
      ? `${SYSTEM_PROMPT}\n\nWICHTIG: Die Raum-ID dieses Nutzers (roomId) ist "${roomId}". Die Nutzer-ID (userId) ist "${userId}". Wenn du transferToAdmin aufrufst, musst du genau diese Werte als roomId und userId senden.`
      : `${SYSTEM_PROMPT}\n\nDieser Nutzer ist nicht eingeloggt. Beantworte ausschließlich allgemeine Informationsfragen. Rufe niemals transferToAdmin auf, erstelle keine Support-Anfrage und verspreche keine Kontaktaufnahme durch das Team.`;

    /* system ai a ozel olan prompt onun ogrenmesı gereken ben socket mimamrisi kullandıgm ıcın dınamık hale getırdm userid ve roomid degerleri sureklı degısken olucagndan dolayı */
    const { text } = await generateText({
      model: groq(DEFAULT_MODEL),
      system: dynamicSystemPrompt,
      messages: [
        ...filterCompatibleMessages(conversationHistory),
        { role: "user", content: userMessage },
      ],
      tools: enableAdminTools ? tools : { dateTime: tools.dateTime },
      stopWhen: stepCountIs(5),
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    const reply = text.trim()
      ? text
      : "Mesajını aldım. Bir yetkili bu sohbete kısa süre içinde bağlanacak.";

    callbacks.onComplete?.(reply);
    return reply;
  } catch (error: any) {
    console.error("[agent] runAgent FAILED", {
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode, // APICallError ise dolu gelir
      responseBody: error?.responseBody, // Groq'un döndüğü gerçek hata
      cause: error?.cause,
    });
    callbacks.onError?.(error);
    throw error;
  }
};
