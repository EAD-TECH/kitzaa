import { tool, type ModelMessage, type ToolSet } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "../system/prompt.js";
import type { EvalData, MultiTurnEvalData } from "../types.js";

export const buildMockedTools = (
  mockTools: MultiTurnEvalData["mockTools"],
): ToolSet => {
  const tools: ToolSet = {};

  for (const [name, config] of Object.entries(mockTools)) {
    const parameterSchema: Record<string, z.ZodTypeAny> = {};

    for (const [parameterName, parameterType] of Object.entries(config.parameters)) {
      parameterSchema[parameterName] =
        parameterType === "number" ? z.number() : z.string();
    }

    tools[name] = tool({
      description: config.description,
      inputSchema: z.object(parameterSchema),
      execute: async () => config.mockReturn,
    });
  }

  return tools;
};

export const buildMessages = (
  data: EvalData | { prompt?: string; systemPrompt?: string },
): ModelMessage[] => [
  { role: "system", content: data.systemPrompt ?? SYSTEM_PROMPT },
  ...(data.prompt ? [{ role: "user" as const, content: data.prompt }] : []),
];
