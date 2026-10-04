import { generateObject } from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";

const DEFAULT_MODEL = "openai/gpt-oss-20b";
export const analyzeApplicationRisk = async ({
  institutionData,
  UserMessage,
}: {
  institutionData: any;
  UserMessage: string;
}) => {
  try {
    const { object } = await generateObject({
      model: groq(DEFAULT_MODEL),
      schema: z.object({
        riskLevel: z
          .enum(["LOW", "MEDIUM", "HIGH"])
          .describe("Başvurunun risk seviyesi"),
        summary: z
          .string()
          .describe("Kurum bilgileri ve mesajın tutarlılık özeti "),
        recommendation: z
          .string()
          .describe("Admin' e bu başvuru için atılması gereken adım onerisi"),
      }),
      system: `Sen Kitzaa etkinlik platformunun kurumsal başvuru denetçisisin. 
      Amacın, yeni organizatör (kurum) başvurularını inceleyip admin için JSON formatında bir risk raporu sunmaktır.
      
      KURALLAR:
      1. Kurumun adı, kategorisi ve sağladığı web sitesi/telefon birbiriyle tutarlı mı kontrol et.
      2. Kullanıcının mesajında spam, anlamsız metin veya şüpheli (dolandırıcılık) bir ifade varsa risk seviyesini HIGH yap.
      3. Veriler temiz, kurumsal ve tutarlı görünüyorsa LOW yap.
      4. Web sitesi yoksa veya bilgiler çok yetersizse MEDIUM yap.
      `,
      prompt: `
        İncelenecek Kurum Verileri:
        - Kurum Adı: ${institutionData.name}
        - Kategori: ${institutionData.category || "Belirtilmemiş"}
        - Web Sitesi: ${institutionData.website || "Belirtilmemiş"}
        - Telefon: ${institutionData.phone || "Belirtilmemiş"}
        - Açıklama: ${institutionData.description || "Belirtilmemiş"}
        
        Kullanıcının Başvuru Mesajı:
        "${UserMessage || "Mesaj bırakılmamış."}"
      `,
    });
    /* yapay zekanın yanıtına tarıh damgasını vurup donduruyorm */
    return { ...object, analyzedAt: new Date() };
  } catch (error) {
    console.error("Risk analizi çöktü:", error);
   /*   Hata durumunda sistemi kurtaran statik obje */
    return {
      riskLevel: "MEDIUM",
      summary: "Yapay zeka analizi yapılamadı.",
      recommendation: "Manuel inceleme gerekiyor.",
      analyzedAt: new Date(),
    };
  }
};
