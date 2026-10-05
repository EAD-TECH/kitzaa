import { generateObject } from "ai";
import type { EventDTO } from "../types/event.types.js";

import { z } from "zod";
import { groq } from "@ai-sdk/groq";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

interface aiRiskAnalysisForEventsProps {
  title: string;
  description: string;
  ageRanges: string[];
  isFree: boolean;
  locationType: string;
  location: string;
  categoryId: string;
}

export const aiRiskAnalysisForEvents = async ({
  title,
  description,
  ageRanges,
  isFree,
  locationType,
  location,
  categoryId,
}: aiRiskAnalysisForEventsProps) => {
  try {
    const { object } = await generateObject({
      model: groq(DEFAULT_MODEL),
      schema: z.object({
        status: z
          .enum(["approved", "pending", "rejected"])
          .describe("Başvurunun statusu"),
        summary: z
          .string()
          .describe("Event bilgileri ve mesajın tutarlılık özeti "),
        recommendation: z
          .string()
          .describe("Admin' e bu başvuru için atılması gereken adım onerisi"),
      }),
      system: `
 Sen Kitzaa etkinlik platformunun otonom içerik moderatörüsün.
Amacın, kullanıcılar tarafından oluşturulan yeni etkinlikleri inceleyip anında yayına alınmasına (approved), admin onayına bırakılmasına (pending) veya reddedilmesine (rejected) karar vermektir. Yanıtını JSON formatında vermelisin.

KURALLAR:
1. İHLAL (rejected): Başlık veya açıklamada küfür, nefret söylemi, şiddet, yasadışı madde/faaliyet veya cinsel içerik varsa statüyü 'rejected' yap.
2. ŞÜPHE (pending): Başlık/açıklama çok kısaysa, anlamsız spam içeriyorsa (örn: 'asdasdasd'), veya seçilen yaş grubu (örn: 0-3 yaş) ile etkinlik içeriği çelişiyorsa (örn: korku evi) statüyü 'pending' yap.
3. DOLANDIRICILIK (pending): Etkinlik 'Ücretsiz' olarak işaretlenmiş ama açıklamada IBAN, bilet ücreti veya para isteniyorsa statüyü 'pending' yap.
4. ONAY (approved): Veriler temiz, anlamlı, yaş grubuyla tutarlı ve güvenli görünüyorsa statüyü saniyesinde 'approved' yap.`,

      prompt: `İncelenecek Etkinlik Verileri:
- Etkinlik Başlığı: ${title}
- Seçilen Yaş Grupları: ${ageRanges.join(", ") || "Belirtilmemiş"}
- Ücretsiz mi?: ${isFree ? "Evet" : "Hayır"}
- Mekan Tipi: ${locationType}
- Lokasyon Bilgisi: ${location}
- Kategori ID: ${categoryId}

Etkinlik Açıklaması:
"${description}"`,
    });
    return { ...object, analyzedAt: new Date() };
  } catch (error) {
    console.error("Risk analizi çöktü:", error);
    /*   Hata durumunda sistemi kurtaran statik obje */
    return {
      status: "pending",
      summary: "Yapay zeka analizi yapılamadı.",
      recommendation: "Manuel inceleme gerekiyor.",
      analyzedAt: new Date(),
    };
  }
};
