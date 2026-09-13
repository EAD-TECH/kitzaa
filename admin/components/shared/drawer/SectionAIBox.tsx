import { Badge } from "@/components/ui/badge";

export default function SectionAIBox() {
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-l bg-sidebar border-kanban-card-border">
      <h2 className="font-heading text-xs text-(--terracotta-600)">
        Yapay Zeka Analizi
      </h2>
      <p className="font-body font-normal leading-6 text-sm">
        Kurum bilgileri ve başvuru mesajı birbiriyle uyumlu görünüyor. Profil,
        eğitim kategorisinde yeni bir organizatör olarak sınıflandırıldı.
      </p>
      <div className="flex flex-wrap gap-2 border border-kanban-card-bg ">
        <Badge className="text-(--terracotta-600) inline-flex items-center text-xs px-1 py-2 bg-(--terracotta-600)/10">
          Düşük Risk
        </Badge>
        <Badge className="px-2 py-2 items-center inline-flex text-(--brown-500) bg-(--brown-500)/20 text-wrap">
          Öneri: Kurum web sitesini doğrulayarak başvuruyu onayla.
        </Badge>
      </div>
    </div>
  );
}
