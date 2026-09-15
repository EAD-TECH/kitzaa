"use client";

import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import KanbanColumn from "@/components/shared/KanbanColumn";
import KanbanSkeleton from "@/components/shared/KanbanSkeleton";
import KanbanErrorState from "@/components/shared/KanbanErrorState";
import { useEventApplications } from "../hooks/useEventApplications";
import EventCard from "./EventCard";
import { useState } from "react";
import FilterAndSearch from "@/components/shared/FilterAndSearch";
import FilterPills from "@/components/shared/FilterPills";
import { useEventCategories } from "../hooks/useEventCategories";
import EventDrawer from "./EventDrawer";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Calendar,
  CircleIcon,
  Loader2,
  UserIcon,
} from "lucide-react";

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
  {
    id: "sort",
    value: "sort",
    label: "Tarihe Göre",
    icon: <Calendar />,
    options: [
      { value: "sort_newest", label: "En Yeniler" },
      { value: "sort_oldest", label: "Eskiler" },
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

  const [siralama, setSiralama] = useState<string>("sort_newest");

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

  /*  const tumEtkinlikler = data?.pages.flatMap((page) => page.events || []) || [];

  const pendingEvents = tumEtkinlikler.filter((e) => e.status === "pending");
  const approvedEvents = tumEtkinlikler.filter((e) => e.status === "approved");
  const rejected = tumEtkinlikler.filter((e) => e.status === "rejected");
  const cancelled = tumEtkinlikler.filter((e) => e.status === "cancelled");
  const completed = tumEtkinlikler.filter((e) => e.status === "completed"); */

  const pendingEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,

    siralama,
    kolonStatus: "pending",
    limit: 3,
  });

  const pendingEvents =
    pendingEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const approvedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "approved",
    limit: 3,
  });

  const approvedEvents =
    approvedEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const rejectedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "rejected",
    limit: 3,
  });

  const rejectedEvents =
    rejectedEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const cancelledEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "cancelled",
    limit: 3,
  });

  const cancelledEvents =
    cancelledEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const completedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "completed",
    limit: 3,
  });

  const completedEvents =
    completedEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const isLoading =
    pendingEvent.isLoading ||
    approvedEvent.isLoading ||
    rejectedEvent.isLoading ||
    cancelledEvent.isLoading ||
    completedEvent.isLoading;

  const isError =
    pendingEvent.isError ||
    approvedEvent.isError ||
    rejectedEvent.isError ||
    cancelledEvent.isError ||
    completedEvent.isError;

  const onFilterSelect = (tiklananDeger: string) => {
    console.log("popoverdan gelen deger", tiklananDeger);
    console.log("popoverın defaultu", seciliStatus);

    if (tiklananDeger.startsWith("sort_")) {
      setSiralama(tiklananDeger);
      return;
    }

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
    <Card className="flex flex-col gap-6 self-stretch rounded-2xl border border-border bg-background p-4 ring-0 shadow-none tablet:p-6">
      {/* baslik*/}
      <PageHeader
        title="Etkinlikler"
        description="Etkinlikleri durumlarına göre yönetin ve yayın akışını takip edin."
      />
      <div className="flex w-full min-w-0 flex-col gap-2 tablet:flex-row tablet:items-center">
        <FilterAndSearch
          searchValue={inputValue}
          onSearchChange={setInputValue}
          filterOptions={filtreSecenekleri}
          selectedValues={
            siralama === "sort_newest"
              ? seciliStatus
              : [...seciliStatus, siralama]
          }
          onFilterSelect={onFilterSelect}
        />
        {(seciliStatus.length > 0 || siralama !== "sort_newest") && (
          <Button
            variant="ghost"
            className="shrink-0 self-start tablet:self-center"
            onClick={() => {
              setSeciliStatus([]);
              setSiralama("sort_newest");
            }}
          >
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
      {!isLoading && isError && (
        <KanbanErrorState
          onRetry={() => {
            pendingEvent.refetch();
            approvedEvent.refetch();
            rejectedEvent.refetch();
            cancelledEvent.refetch();
            completedEvent.refetch();
          }}
        />
      )}

      {/* hata yoksa  */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 desktop:flex desktop:items-start desktop:overflow-x-auto">
          {/* pendıng*/}
          {(seciliStatus.length === 0 || seciliStatus.includes("pending")) && (
            <KanbanColumn
              title="Onay Bekliyor"
              count={pendingEvents.length}
              dotColor="bg-yellow-500"
              fetchNextPage={pendingEvent.fetchNextPage}
              hasNextPage={pendingEvent.hasNextPage}
              isFetchingNextPage={pendingEvent.isFetchingNextPage}
            >
              {pendingEvents.map((event) => (
                <EventCard key={event._id} application={event} />
              ))}
            </KanbanColumn>
          )}

          {/* onaylı */}
          {(seciliStatus.length === 0 || seciliStatus.includes("approved")) && (
            <KanbanColumn
              title="Yayında"
              count={approvedEvents.length}
              dotColor="bg-green-500"
              fetchNextPage={approvedEvent.fetchNextPage}
              hasNextPage={approvedEvent.hasNextPage}
              isFetchingNextPage={approvedEvent.isFetchingNextPage}
            >
              {approvedEvents.map((event) => (
                <EventCard key={event._id} application={event} />
              ))}
            </KanbanColumn>
          )}
          {/*  Rejected */}
          {(seciliStatus.length === 0 || seciliStatus.includes("rejected")) && (
            <KanbanColumn
              title="Rejected"
              count={rejectedEvents.length}
              dotColor="bg-red-500"
              fetchNextPage={rejectedEvent.fetchNextPage}
              hasNextPage={rejectedEvent.hasNextPage}
              isFetchingNextPage={rejectedEvent.isFetchingNextPage}
            >
              {rejectedEvents.map((event) => (
                <EventCard key={event._id} application={event} />
              ))}
            </KanbanColumn>
          )}

          {/*  Cancelled */}
          {(seciliStatus.length === 0 ||
            seciliStatus.includes("cancelled")) && (
            <KanbanColumn
              title="Cancelled"
              count={cancelledEvents.length}
              dotColor="bg-gray-500"
              fetchNextPage={cancelledEvent.fetchNextPage}
              hasNextPage={cancelledEvent.hasNextPage}
              isFetchingNextPage={cancelledEvent.isFetchingNextPage}
            >
              {cancelledEvents.map((event) => (
                <EventCard key={event._id} application={event} />
              ))}
            </KanbanColumn>
          )}

          {/* completed */}
          {(seciliStatus.length === 0 ||
            seciliStatus.includes("completed")) && (
            <KanbanColumn
              title="Completed"
              count={completedEvents.length}
              dotColor="bg-blue-500"
              fetchNextPage={completedEvent.fetchNextPage}
              hasNextPage={completedEvent.hasNextPage}
              isFetchingNextPage={completedEvent.isFetchingNextPage}
            >
              {completedEvents.map((event) => (
                <EventCard key={event._id} application={event} />
              ))}
            </KanbanColumn>
          )}
        </div>
      )}

      {/*  {(hasNextPage || isFetchingNextPage) && (
        <div className="mt-6 flex w-full justify-center pb-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className=" max-w-md rounded-full border-2 border-border bg-transparent py-6 text-foreground transition-all hover:border-primary hover:bg-muted hover:text-primary shadow-none"
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
      )} */}
      <EventDrawer />
    </Card>
  );
}
