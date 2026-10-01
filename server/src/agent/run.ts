import { google } from "@ai-sdk/google";
import { generateText, type ModelMessage } from "ai";
import { executeTool } from "./executeTool.js";
import { filterCompatibleMessages } from "./system/filterMessages.js";
import { SYSTEM_PROMPT } from "./system/prompt.js";
import { tools } from "./tools/index.js";
import type { AgentCallbacks } from "./types.js";

const DEFAULT_MODEL = "gemini-3.8-flash";

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[] = [],
  callbacks: AgentCallbacks = {},
): Promise<string> => {
  callbacks.onStart?.();

  try {
    const { text, toolCalls } = await generateText({
      model: google(DEFAULT_MODEL),
      system: SYSTEM_PROMPT,
      messages: [
        ...filterCompatibleMessages(conversationHistory),
        { role: "user", content: userMessage },
      ],
      tools,
    });

    for (const toolCall of toolCalls) {
      await executeTool({
        name: toolCall.toolName,
        args: ("input" in toolCall ? toolCall.input : {}) as Record<string, unknown>,
      });
    }

    callbacks.onComplete?.(text);
    return text;
  } catch (error) {
    callbacks.onError?.(error);
    throw error;
  }
};
