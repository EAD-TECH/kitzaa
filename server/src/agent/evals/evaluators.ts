import type {
  EvalTarget,
  MultiTurnResult,
  MultiTurnTarget,
  SingleTurnResult,
} from "../types.js";

export function toolsSelected(
  output: SingleTurnResult | MultiTurnResult,
  target: EvalTarget | MultiTurnTarget,
): number {
  const expectedTools =
    (target as EvalTarget).expectedTools ??
    (target as MultiTurnTarget).expectedToolOrder;
  if (!expectedTools?.length) return 1;

  const selected = new Set(
    "toolNames" in output ? output.toolNames : output.toolsUsed,
  );
  return expectedTools.every((toolName: string) => selected.has(toolName)) ? 1 : 0;
}

export function toolsAvoided(
  output: SingleTurnResult | MultiTurnResult,
  target: EvalTarget | MultiTurnTarget,
): number {
  if (!target.forbiddenTools?.length) return 1;

  const selected = new Set(
    "toolNames" in output ? output.toolNames : output.toolsUsed,
  );
  return target.forbiddenTools.some((toolName) => selected.has(toolName)) ? 0 : 1;
}

export function toolSelectionScore(
  output: SingleTurnResult,
  target: EvalTarget,
): number {
  if (!target.expectedTools?.length) return output.selectedAny ? 0.5 : 1;

  const expected = new Set(target.expectedTools);
  const selected = new Set(output.toolNames);
  const hits = output.toolNames.filter((toolName) => expected.has(toolName)).length;
  const precision = selected.size ? hits / selected.size : 0;
  const recall = expected.size ? hits / expected.size : 0;

  return precision + recall === 0
    ? 0
    : (2 * precision * recall) / (precision + recall);
}
