import { tools } from "./tools/index.js";

export type ToolName = keyof typeof tools;

export const executeTool = async ({
  name,
  args,
}: {
  name: string;
  args: Record<string, unknown>;
}): Promise<string> => {


/* yapay zeka bana dondugu toolcall da su tool u(mesela admintoTransfer) calıstırmalısın derse ai dsk i bana bu taliamtı generateText içinde getirir bu executeTools manuel bır santral mantıgı gıbı ; ai su toola baglanmak ıstıyorum derse executeTools sekreterı tool ısmını tools dosyasında arıyor eger varsa o tool u tetıkleyıp sonucu bir değişkene kaydediyor aşagıda result ıcıne kaydettı */



  const selectedTool = tools[name as ToolName];

  if (!selectedTool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  if (!selectedTool.execute) {
    throw new Error(`Tool is not executable: ${name}`);
  }

  /* yapay zeka su tool u calistir dediginde ona ait bir toolCallId atar.execute fonksiyonundan secılen toolu bulup donen sonucu bır degıskene aıtoyrm baslangıc degerlerını bos atıyorum */

  const result = await selectedTool.execute(args as never, {
    toolCallId: "",
    messages: [],
    context: undefined,
  } as never);

  return String(result);
};
