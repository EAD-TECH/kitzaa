import { redisClient } from "../../configs/redis.js";
import {
  aiEventSearchOutputSchema,
  type AiEventSearchOutput,
} from "../../validations/ai/ai-event-search-output.validation.js";

const CONVERSATION_TTL = 60 * 30; // 30 dakika

const getConversationKey = (conversationId: string) => `conversation:${conversationId}`;

export const saveConversationState = async (conversationId: string, state: AiEventSearchOutput) => {
  const key = getConversationKey(conversationId);

  await redisClient.set(key, JSON.stringify(state), {
    EX: CONVERSATION_TTL,
  });
};
 
export const getConversationState = async (conversationId: string): Promise<AiEventSearchOutput | null> => {
  const key = getConversationKey(conversationId);

  const state = await redisClient.get(key);

  if (!state) {
    return null;
  }

  try {
    const parsedState = aiEventSearchOutputSchema.safeParse(JSON.parse(state));

    if (parsedState.success) {
      return parsedState.data;
    }
  } catch {
    // Invalid or legacy state is removed below and the conversation starts fresh.
  }

  await redisClient.del(key);
  return null;
};

export const deleteConversationState = async (conversationId: string) => {
  const key = getConversationKey(conversationId);

  await redisClient.del(key);
};