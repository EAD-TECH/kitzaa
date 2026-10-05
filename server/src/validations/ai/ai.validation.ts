import { z } from "zod";

export const aiEventSearchRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message cannot exceed 500 characters"),
  conversationId: z.string().uuid().optional(),
}).strict();


