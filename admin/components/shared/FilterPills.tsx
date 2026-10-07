import { Button } from "@/components/ui/button";

interface FilterPillsProps {
  kategoriler: string[]
  aktifKategori: string;
  onKategoriSec: (kategori: string) => void;
  /* Optional display label when the value itself shouldn't be shown (e.g. "organizer" -> "Organisator") */
  getLabel?: (kategori: string) => string;
}

export default function FilterPills({
  kategoriler,
  aktifKategori,
  onKategoriSec,
  getLabel,
}: FilterPillsProps) {
  return (
    <div className="flex min-w-0  flex-row gap-1.5 flex-wrap items-center">
      {kategoriler.map((category) => (
        <Button
          onClick={() => onKategoriSec(category)}
          variant={category === aktifKategori ? "default" : "ghost"}
          key={category}
          className={
            category === aktifKategori
              ? "rounded-full px-4 py-2 font-normal bg-primary text-primary-foreground"
              : " rounded-full px-4 py-2 bg-muted text-muted-foreground font-normal"
          }
        >
          {getLabel ? getLabel(category) : category}
        </Button>
      ))}
    </div>
  );
}
