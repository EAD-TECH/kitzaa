import { Badge } from "@/components/ui/badge";
import { SectionAIBoxProps } from "../types";


export default function SectionAIBox({ aiAnalysis }: SectionAIBoxProps) {
 
  if (!aiAnalysis || (!('riskLevel' in aiAnalysis) && !('status' in aiAnalysis))) return null;

  let badgeStyle = "text-gray-800 bg-gray-100";
  let badgeText = "Bilinmeyen Durum";

  
  if ('riskLevel' in aiAnalysis && aiAnalysis.riskLevel) {
    if (aiAnalysis.riskLevel === "LOW") {
      badgeStyle = "text-primary bg-primary/10";
      badgeText = "Düşük Risk";
    } else if (aiAnalysis.riskLevel === "MEDIUM") {
      badgeStyle = "text-yellow-700 bg-yellow-100";
      badgeText = "Orta Risk";
    } else if (aiAnalysis.riskLevel === "HIGH") {
      badgeStyle = "text-destructive bg-destructive/10";
      badgeText = "Yüksek Risk";
    }
  } 

  else if ('status' in aiAnalysis && aiAnalysis.status) {
    if (aiAnalysis.status === "approved") {
      badgeStyle = "text-primary bg-primary/10";
      badgeText = "Onaylandı (Güvenli)";
    } else if (aiAnalysis.status === "pending") {
      badgeStyle = "text-yellow-700 bg-yellow-100";
      badgeText = "İnceleme Gerekiyor";
    } else if (aiAnalysis.status === "rejected") {
      badgeStyle = "text-destructive bg-destructive/10";
      badgeText = "İhlal / Reddedildi";
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-l bg-sidebar border-kanban-card-border">
      <h2 className="font-heading text-xs text-primary">Yapay Zeka Analizi</h2>
      <p className="font-body font-normal leading-6 text-sm">
        {aiAnalysis.summary}
      </p>
      <div className="flex flex-wrap gap-2 border border-kanban-card-bg ">
       
        <Badge className={` inline-flex items-center text-xs px-1 py-2 ${badgeStyle}`}>
          {badgeText}
        </Badge>
        <Badge className="px-2 py-2 items-center inline-flex text-muted-foreground bg-muted text-wrap">
          {aiAnalysis.recommendation}
        </Badge>
      </div>
    </div>
  );
}