import { Badge } from "@/components/ui/badge";
import { OrganizerApplicationDTO } from "@/features/organizer-applications/types";

/* tum dto ları deıl sadece aiAnalysis cekmecesını getır */
interface SectionAIBoxProps {
  aiAnalysis: OrganizerApplicationDTO["aiAnalysis"];
}

export default function SectionAIBox({ aiAnalysis }: SectionAIBoxProps) {
  if (!aiAnalysis || !aiAnalysis.riskLevel) return null;

  let riskStyle = "text-gray-800 bg-gray-100";
  let riskText = "Bilinmeyen Risk";

  if (aiAnalysis.riskLevel === "LOW") {
    riskStyle = "text-primary bg-primary/10";
    riskText = "Düşük Risk";
  } else if (aiAnalysis.riskLevel === "MEDIUM") {
    riskStyle = "text-yellow-700 bg-yellow-100";
    riskText = "Orta Risk";
  } else if (aiAnalysis.riskLevel === "HIGH") {
    riskStyle = "text-destructive bg-destructive/10";
    riskText = "Yüksek Risk";
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-l bg-sidebar border-kanban-card-border">
      <h2 className="font-heading text-xs text-primary">Yapay Zeka Analizi</h2>
      <p className="font-body font-normal leading-6 text-sm">
        {/*    Kurum bilgileri ve başvuru mesajı birbiriyle uyumlu görünüyor. Profil,
        eğitim kategorisinde yeni bir organizatör olarak sınıflandırıldı. */}
        {aiAnalysis.summary}
      </p>
      <div className="flex flex-wrap gap-2 border border-kanban-card-bg ">
        <Badge
          className={` inline-flex items-center text-xs px-1 py-2  ${riskStyle}`}
        >
          {/* Düşük Risk */}
          {riskText}
        </Badge>
        <Badge className="px-2 py-2 items-center inline-flex text-muted-foreground bg-muted text-wrap">
          {/*   Öneri: Kurum web sitesini doğrulayarak başvuruyu onayla. */}
          {aiAnalysis.recommendation}
        </Badge>
      </div>
    </div>
  );
}
