import { Badge } from "@/components/ui/badge";

export default function SectionAIBox() {
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-l bg-sidebar border-kanban-card-border">
      <h2 className="font-heading text-xs text-primary">
        KI-Analyse
      </h2>
      <p className="font-body font-normal leading-6 text-sm">
        Die Angaben zur Einrichtung und die Antragsnachricht passen zueinander.
        Das Profil wurde als neuer Organisator in der Kategorie Bildung eingestuft.
      </p>
      <div className="flex flex-wrap gap-2 border border-kanban-card-bg ">
        <Badge className="text-primary inline-flex items-center text-xs px-1 py-2 bg-primary/10">
          Geringes Risiko
        </Badge>
        <Badge className="px-2 py-2 items-center inline-flex text-muted-foreground bg-muted text-wrap">
          Empfehlung: Website der Einrichtung prüfen und Antrag genehmigen.
        </Badge>
      </div>
    </div>
  );
}
