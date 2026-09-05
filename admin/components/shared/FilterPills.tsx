import { Button } from "@/components/ui/button";
import { useOrganizerApplications } from "@/features/admin/hooks/useOrganizerApplications";
/* const categories = ["Tümü", "Kültür", "Spor", "Eğitim", "Eğlence"];
 */

interface FilterPillsProps {
  kategoriler: string[]
  aktifKategori: string;
  onKategoriSec: (kategori: string) => void;
}

export default function FilterPills({
  kategoriler,
  aktifKategori,
  onKategoriSec,
}: FilterPillsProps) {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap items-center">
      {kategoriler.map((category) => (
        <Button
          onClick={() => onKategoriSec(category)}
          variant={category === aktifKategori ? "default" : "ghost"}
          key={category}
          className={
            category === aktifKategori
              ? "rounded-full px-4 py-2 font-normal bg-(--terracotta-600) text-(--cream-50)"
              : " rounded-full px-4 py-2 bg-(--cream-200) text-(--brown-500) font-normal"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
