"use client";

import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import KanbanColumn from "@/components/shared/KanbanColumn";
import KanbanSkeleton from "@/components/shared/KanbanSkeleton";
import KanbanErrorState from "@/components/shared/KanbanErrorState";
import { useEventApplications } from "../../hooks/useEventApplications";
import EventCard from "./EventCard";
import { useState } from "react";
import FilterAndSearch from "@/components/shared/FilterAndSearch";
import FilterPills from "@/components/shared/FilterPills";
import { useEventCategories } from "../../hooks/useEventCategories";
import EventDrawer from "./EventDrawer";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ArrowDown, CircleIcon, Loader2, UserIcon } from "lucide-react";

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
      { value: "cancelled", label: "İptal Edilenler" },
      { value: "completed", label: "Tamamlananlar" },
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

export default function AdminEventsBoard() {
  const [aktifKategori, SetAktifKategori] = useState("Tümü");
  const { data: categoriesResponse } = useEventCategories();
  console.log(categoriesResponse);
  const [inputValue, setInputValue] = useState("");
  const [sakinKelime] = useDebounce(inputValue, 400);

  const [seciliStatus, setSeciliStatus] = useState<string[]>([]);

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data ||
      (categoriesResponse as any)?.categories ||
      [];
  console.log(categories);

  const categoryNames = categories.map((cat: any) => cat.name);
  console.log(categoryNames);
  const benzersizkategoriler = ["Tümü", ...categoryNames];

  const seciliKategoriObj = categories.find(
    (cat: any) => cat.name === aktifKategori,
  );
  console.log(seciliKategoriObj);
  const seciliKategoriId = seciliKategoriObj
    ? seciliKategoriObj._id
    : undefined;
  console.log(seciliKategoriId);

  const onKategoriSec = (kategori: string) => {
    SetAktifKategori(kategori);
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    limit: 6,
  });

  const tumEtkinlikler = data?.pages.flatMap((page) => page.events || []) || [];

  const pendingEvents = tumEtkinlikler.filter((e) => e.status === "pending");
  const approvedEvents = tumEtkinlikler.filter((e) => e.status === "approved");
  const rejected = tumEtkinlikler.filter((e) => e.status === "rejected");
  const cancelled = tumEtkinlikler.filter((e) => e.status === "cancelled");
  const completed = tumEtkinlikler.filter((e) => e.status === "completed");

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
      {/* baslik*/}
      <PageHeader
        title="Etkinlikler"
        description="Etkinlikleri durumlarına göre yönetin ve yayın akışını takip edin."
      />
      <div className="flex w-fit  items-center gap-2">
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

      <FilterPills
        kategoriler={benzersizkategoriler}
        aktifKategori={aktifKategori}
        onKategoriSec={onKategoriSec}
      />

      {/* yukenıyor */}
      {isLoading && <KanbanSkeleton />}

      {/* hata durumu*/}
      {!isLoading && isError && <KanbanErrorState onRetry={refetch} />}

      {/* hata yoksa  */}
      {!isLoading && !isError && (
        <div className="flex flex-row gap-4 overflow-x-auto">
          {/* pendıng*/}
          <KanbanColumn
            title="Onay Bekliyor"
            count={pendingEvents.length}
            dotColor="bg-yellow-500"
          >
            {pendingEvents.map((event) => (
              <EventCard key={event._id} application={event} />
            ))}
          </KanbanColumn>

          {/* onaylı */}
          <KanbanColumn
            title="Yayında"
            count={approvedEvents.length}
            dotColor="bg-green-500"
          >
            {approvedEvents.map((event) => (
              <EventCard key={event._id} application={event} />
            ))}
          </KanbanColumn>
          {/*  Rejected */}
          <KanbanColumn
            title="Rejected"
            count={rejected.length}
            dotColor="bg-red-500"
          >
            {rejected.map((event) => (
              <EventCard key={event._id} application={event} />
            ))}
          </KanbanColumn>
          {/*  Cancelled */}
          <KanbanColumn
            title="Cancelled"
            count={cancelled.length}
            dotColor="bg-gray-500"
          >
            {cancelled.map((event) => (
              <EventCard key={event._id} application={event} />
            ))}
            {/* completed */}
          </KanbanColumn>
          <KanbanColumn
            title="Completed"
            count={completed.length}
            dotColor="bg-blue-500"
          >
            {completed.map((event) => (
              <EventCard key={event._id} application={event} />
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
                Etkinlikler Yükleniyor...
              </>
            ) : (
              <>
                <ArrowDown className="mr-2 h-5 w-5" />
                Daha Fazla Etkinlik Yükle
              </>
            )}
          </Button>
        </div>
      )}
      <EventDrawer />
    </Card>
  );
}
