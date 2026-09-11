import FilterAndSearch from "@/components/shared/FilterAndSearch";
import KanbanColumn from "@/components/shared/KanbanColumn";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import OrganizerApplicationCard from "./OrganizerApplicationCard";
import { useOrganizerApplications } from "../../hooks/useOrganizerApplications";
import { OrganizerApplicationDTO } from "../../types";
import KanbanSkeleton from "@/components/shared/KanbanSkeleton";
import KanbanErrorState from "@/components/shared/KanbanErrorState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, CircleIcon, Loader2, UserIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import ReusableDrawer from "@/components/shared/drawer/ReusableDrawer";

const filtreSecenekleri = [
  {
    id: "status",
    value: "status",
    label: "Status (Durum)",
    icon: <CircleIcon />,
    options: [
      { value: "pending", label: "Yeni Başvurular" },
      { value: "approved", label: "Onaylananlar" },
      { value: "rejected", label: "Reddeilenler" },
    ],
  },
  {
    id: "assignee",
    value: "assignee",
    label: "Assignee (Atanan Kişi)",
    icon: <UserIcon />,
    options: [
      { value: "elif", label: "Elif" },
      { value: "ayla", label: "Ayla" },
      { value: "duygu", label: "Duygu" },
    ],
  },
];

export default function OrganizerApplicationBoard() {
  const [inputValue, setInputValue] = useState("");
  const [sakinKelime] = useDebounce(inputValue, 400);
  const [seciliStatus, setSeciliStatus] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrganizerApplications({
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    limit: 6,
  });
  /* flatMap */
  const tumBasvurular =
    data?.pages.flatMap((page) => page.applications || []) || [];
  console.log(tumBasvurular);

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

  const onFilterSelect = (tiklananDeger: string) => {
    console.log("popoverdan gelen deger", tiklananDeger);
    console.log("popoverın defaultu", seciliStatus);

    const varMi = seciliStatus.includes(tiklananDeger);
    console.log("bu deger dızı de varmı", varMi);
    if (varMi) {
      let yeniDizi = seciliStatus.filter((deger) => deger != tiklananDeger);
      setSeciliStatus(yeniDizi);
    } else {
      setSeciliStatus([...seciliStatus, tiklananDeger]);
    }
  };

  return (
    <Card className="flex flex-col gap-6 self-stretch rounded-2xl border border-border bg-(--cream-50) p-6 ring-0 shadow-none">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="Organizatör Başvuruları"
          description="Başvuruları yönetin"
        />

        <div className="flex w-fit items-center gap-2">
          <FilterAndSearch
            searchValue={inputValue}
            onSearchChange={setInputValue}
            filterOptions={filtreSecenekleri}
            selectedValues={seciliStatus}
            onFilterSelect={onFilterSelect}
          />
           {seciliStatus.length > 0 && (
          <Button variant="ghost" onClick={() => setSeciliStatus([])}>
            Temizle 
          </Button>
        )}
        </div>
      </div>

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
      <ReusableDrawer />
    </Card>
  );
}
