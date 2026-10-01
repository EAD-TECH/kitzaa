import { google } from "@ai-sdk/google";
import { generateText, stepCountIs, type ModelMessage, type ToolSet } from "ai";
import { buildMessages, buildMockedTools } from "./utils.js";
import type {
  EvalData,
  MultiTurnEvalData,
  MultiTurnResult,
  SingleTurnResult,
} from "../types.js";
import { SYSTEM_PROMPT } from "../system/prompt.js";

const DEFAULT_MODEL = "gemini-3.8-flash";

export async function singleTurnExecutor(
  data: EvalData,
  availableTools: ToolSet,
): Promise<SingleTurnResult> {
  const tools: ToolSet = {};

  for (const toolName of data.tools) {
    const selectedTool = availableTools[toolName];
    if (selectedTool) tools[toolName] = selectedTool;
  }

  const result = await generateText({
    model: google(data.config?.model ?? DEFAULT_MODEL),
    messages: buildMessages(data),
    tools,
    stopWhen: stepCountIs(1),
    temperature: data.config?.temperature,
  });

  const toolCalls = result.toolCalls.map((toolCall) => ({
    toolName: toolCall.toolName,
    args: "input" in toolCall ? toolCall.input : {},
  }));

  return {
    toolCalls,
    toolNames: toolCalls.map(({ toolName }) => toolName),
    selectedAny: toolCalls.length > 0,
  };
}

export async function multiTurnWithMocks(
  data: MultiTurnEvalData,
): Promise<MultiTurnResult> {
  const messages: ModelMessage[] = data.messages ?? [
    { role: "system", content: SYSTEM_PROMPT },
    ...(data.prompt ? [{ role: "user", content: data.prompt } satisfies ModelMessage] : []),
  ];
  const result = await generateText({
    model: google(data.config?.model ?? DEFAULT_MODEL),
    messages,
    tools: buildMockedTools(data.mockTools),
    stopWhen: stepCountIs(data.config?.maxSteps ?? 20),
  });

  const toolCallOrder = result.steps.flatMap((step) =>
    step.toolCalls.map((toolCall) => toolCall.toolName),
  );

  return {
    text: result.text,
    steps: result.steps.map((step) => ({
      toolCalls: step.toolCalls.length
        ? step.toolCalls.map((toolCall) => ({
            toolName: toolCall.toolName,
            args: "input" in toolCall ? toolCall.input : {},
          }))
        : undefined,
      toolResults: step.toolResults.length
        ? step.toolResults.map((toolResult) => ({
            toolName: toolResult.toolName,
            result: "result" in toolResult ? toolResult.result : toolResult,
          }))
        : undefined,
      text: step.text || undefined,
    })),
    toolsUsed: [...new Set(toolCallOrder)],
    toolCallOrder,
  };
}
