import FilterAndSearch from "@/components/shared/FilterAndSearch";
import KanbanColumn from "@/components/shared/KanbanColumn";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import OrganizerApplicationCard from "./OrganizerApplicationCard";
import { useOrganizerApplications } from "../../hooks/useOrganizerApplications";
import { OrganizerApplicationDTO } from "../../types";
import FilterPills from "@/components/shared/FilterPills";
import KanbanSkeleton from "@/components/shared/KanbanSkeleton";
import KanbanErrorState from "@/components/shared/KanbanErrorState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";

export default function OrganizerApplicationBoard() {
  const [aktifKategori, SetAktifKategori] = useState("Tümü");
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrganizerApplications({
    secilenKategori: aktifKategori,
    limit: 6,
  });
  /* flatMap */
  const tumBasvurular =
    data?.pages.flatMap((page) => page.applications || []) || [];
  console.log(tumBasvurular);

  /* const applications: OrganizerApplicationDTO[] = data?.applications || []; */
  /* console.log(applications); */

  const cekilenKategoriler = tumBasvurular
    .map((app) => app.institutionData?.category)
    .filter((kategori): kategori is string => Boolean(kategori));

  const benzersizkategoriler = ["Tümü", ...new Set(cekilenKategoriler)];

  const yeniBasvurular = tumBasvurular.filter(
    (app: OrganizerApplicationDTO) => app.status === "pending",
  );

  const incelemedekiler = tumBasvurular.filter(
    (app: OrganizerApplicationDTO) => app.status === "under_review",
  );

  const kararaBaglananlar = tumBasvurular.filter(
    (app: OrganizerApplicationDTO) =>
      app.status === "approved" || app.status === "rejected",
  );

  const onKategoriSec = (kategori: string) => {
    SetAktifKategori(kategori);
  };

  return (
    <Card className="flex flex-col gap-6 self-stretch rounded-2xl border border-border bg-(--cream-50) p-6 ring-0 shadow-none">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="Organizatör Başvuruları"
          description="Başvuruları yönetin"
        />

        <div className="flex items-center gap-2">
          <FilterAndSearch
            searchValue=""
            onSearchChange={() => {}}
            filterOptions={[]}
            selectedValues={[]}
            onFilterSelect={() => {}}
          />
        </div>
      </div>

      <FilterPills
        kategoriler={benzersizkategoriler}
        aktifKategori={aktifKategori}
        onKategoriSec={onKategoriSec}
      />

      {isLoading && <KanbanSkeleton />}

      {!isLoading && isError && <KanbanErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="flex flex-row gap-4 overflow-x-auto">
          <KanbanColumn title="Yeni" count={yeniBasvurular.length}>
            {yeniBasvurular.map((basvuru) => (
              <OrganizerApplicationCard
                key={basvuru._id}
                application={basvuru}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn title="İncelemede" count={incelemedekiler.length}>
            {/* TODO [KTZ-201]: backend akışına bakılacak, endpoint henüz yok */}
            {incelemedekiler.map((basvuru) => (
              <OrganizerApplicationCard
                key={basvuru._id}
                application={basvuru}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn
            title="Approved/Rejected"
            count={kararaBaglananlar.length}
          >
            {kararaBaglananlar.map((basvuru) => (
              <OrganizerApplicationCard
                key={basvuru._id}
                application={basvuru}
              />
            ))}
          </KanbanColumn>
        </div>
      )}

      {(hasNextPage || isFetchingNextPage) && (
        <div className="mt-6 flex w-full justify-center pb-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
        
            className=" max-w-md rounded-full border-2 border-kanban-card-border bg-transparent py-6 text-kanban-card-title transition-all hover:border-terracotta-600 hover:bg-(--cream-200) hover:text-terracotta-600 shadow-none"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Başvurular Yükleniyor...
              </>
            ) : (
              <>
                <ArrowDown className="mr-2 h-5 w-5" />
                Daha Fazla Başvuru Yükle
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
