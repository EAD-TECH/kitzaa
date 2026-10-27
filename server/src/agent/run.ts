import { groq } from "@ai-sdk/groq";
import { generateText, stepCountIs, type ModelMessage } from "ai";
import { Laminar } from "@lmnr-ai/lmnr";
import { filterCompatibleMessages } from "./system/filterMessages.js";
import { SYSTEM_PROMPT } from "./system/prompt.js";
import { tools } from "./tools/index.js";
import type { AgentCallbacks } from "./types.js";

const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MAX_HISTORY = 10;
const telemetryEnabled = !!process.env.LMNR_API_KEY;

if (telemetryEnabled) {
  Laminar.initialize({ projectApiKey: process.env.LMNR_API_KEY });
}

export const runAgent = async (
  userMessage: string,
  roomId: string,
  userId: string,
  conversationHistory: ModelMessage[] = [],
  callbacks: AgentCallbacks = {},
  options: { enableAdminTools?: boolean } = {},
): Promise<string> => {
  const enableAdminTools = options.enableAdminTools !== false;
  console.log("[agent] runAgent CALLED", { roomId, userId, enableAdminTools });
  callbacks.onStart?.();

  try {
    /* socket mimarisi: roomId ve userId her istekte değiştiği için system prompt dinamik */
    const dynamicSystemPrompt = enableAdminTools
      ? `${SYSTEM_PROMPT}\n\nWICHTIG: Die Raum-ID dieses Nutzers (roomId) ist "${roomId}". Die Nutzer-ID (userId) ist "${userId}". Wenn du transferToAdmin aufrufst, musst du genau diese Werte als roomId und userId senden.`
      : `${SYSTEM_PROMPT}\n\nDieser Nutzer ist nicht eingeloggt. Beantworte ausschließlich allgemeine Informationsfragen. Rufe niemals transferToAdmin auf und verspreche keine Kontaktaufnahme durch das Team. Wenn der Nutzer Hilfe bei seinem Konto, einer ausstehenden Freigabe oder einer Beschwerde braucht, bitte ihn freundlich, sich einzuloggen.`;

    const history =
      filterCompatibleMessages(conversationHistory).slice(-MAX_HISTORY);

    const { text } = await generateText({
      model: groq(DEFAULT_MODEL),
      system: dynamicSystemPrompt,
      messages: [...history, { role: "user", content: userMessage }],
      tools: enableAdminTools ? tools : { dateTime: tools.dateTime },
      stopWhen: stepCountIs(5),
      temperature: 0.2,
      maxRetries: 3,
      experimental_repairToolCall: async ({ toolCall, error }) => {
        console.warn(
          "[agent] geçersiz tool çağrısı:",
          toolCall.toolName,
          error.message,
        );
        return null;
      },
     experimental_telemetry: { isEnabled: telemetryEnabled },
       
    });

    const fallback = enableAdminTools
      ? "Ich habe deine Nachricht erhalten. Eine Person aus dem Team meldet sich in Kürze."
      : "Ich habe deine Nachricht erhalten. Bitte logge dich ein, damit dir das Team weiterhelfen kann.";

    const reply = text.trim() ? text : fallback;

    callbacks.onComplete?.(reply);
    return reply;
  } catch (error: any) {
    console.error("[agent] runAgent FAILED", {
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode,
      responseBody: error?.responseBody,
      cause: error?.cause,
    });
    callbacks.onError?.(error);
    throw error;
  }
};
