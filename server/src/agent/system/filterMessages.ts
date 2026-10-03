import type { ModelMessage } from "ai";

export const filterCompatibleMessages = (
  messages: ModelMessage[],
): ModelMessage[] =>
  messages.filter((message) => {
    if (message.role === "user" || message.role === "system") return true;
    if (message.role === "tool") return true;

    if (message.role !== "assistant") return false;
    if (typeof message.content === "string") return message.content.trim().length > 0;

    return message.content.some((part) => {
      if (part.type !== "text") return false;
      return part.text.trim().length > 0;
    });
  });
