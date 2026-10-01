import type { ModelMessage } from "ai";

export interface AgentCallbacks {
  onStart?: () => void;
  onComplete?: (response: string) => void;
  onError?: (error: unknown) => void;
}

export interface EvalData {
  prompt: string;
  systemPrompt?: string;
  tools: string[];
  config?: {
    model?: string;
    temperature?: number;
  };
}

export interface EvalTarget {
  expectedTools?: string[];
  forbiddenTools?: string[];
  category: "golden" | "secondary" | "negative";
}

export interface SingleTurnResult {
  toolCalls: Array<{ toolName: string; args: unknown }>;
  toolNames: string[];
  selectedAny: boolean;
}

export interface MultiTurnEvalData {
  prompt?: string;
  messages?: ModelMessage[];
  mockTools: Record<string, MockToolConfig>;
  config?: {
    model?: string;
    maxSteps?: number;
  };
}

export interface MockToolConfig {
  description: string;
  parameters: Record<string, string>;
  mockReturn: string;
}

export interface MultiTurnTarget {
  originalTask: string;
  expectedToolOrder?: string[];
  forbiddenTools?: string[];
  mockToolResults: Record<string, string>;
  category: "task-completion" | "conversation-continuation" | "negative";
}

export interface MultiTurnResult {
  text: string;
  steps: Array<{
    toolCalls?: Array<{ toolName: string; args: unknown }>;
    toolResults?: Array<{ toolName: string; result: unknown }>;
    text?: string;
  }>;
  toolsUsed: string[];
  toolCallOrder: string[];
}
