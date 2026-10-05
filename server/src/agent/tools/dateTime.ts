import { tool } from "ai";
import { z } from "zod";

export const dateTime = tool({
  description: "Returns the current date and time. Use this tool before any time-related task.",
  inputSchema: z.object({}),
  execute: async () => `The current date time in ISO format is: ${new Date().toISOString()}`,
});
