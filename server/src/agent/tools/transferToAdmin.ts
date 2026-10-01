import { tool } from "ai";
import { z } from "zod";

export const transferToAdmin = tool({
  description:
    "Transfer users to an administrator when they report a pending event or request an administrator.",
  inputSchema: z.object({
    parameters: z.object({
      reason: z.string().describe("A short reason for the administrator transfer."),
    }),
  }),
  execute: async ({ parameters: { reason } }) =>
    `Sistem mesajı: Kullanıcının talebi "${reason}" sebebiyle başarıyla admin yetkililerine iletildi. Kullanıcıya işlemin tamamlandığını ve beklemesi gerektiğini söyle.`,
});
