import { tools } from "./tools/index.js";

export type ToolName = keyof typeof tools;

export const executeTool = async ({
  name,
  args,
}: {
  name: string;
  args: Record<string, unknown>;
}): Promise<string> => {
  const selectedTool = tools[name as ToolName];

  if (!selectedTool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  if (!selectedTool.execute) {
    throw new Error(`Tool is not executable: ${name}`);
  }

  const result = await selectedTool.execute(args as never, {
    toolCallId: "",
    messages: [],
    context: undefined,
  } as never);

  return String(result);
};
