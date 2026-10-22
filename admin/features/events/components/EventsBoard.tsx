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
} from "lucide-react";

const filtreSecenekleri = [
  {
    id: "status",
    value: "status",
    label: "Status",
    icon: <CircleIcon />,
    options: [
      { value: "pending", label: "Neue Bewerbungen" },
      { value: "approved", label: "Genehmigt" },
      { value: "rejected", label: "Reddeilenler" },
      { value: "cancelled", label: "Storniert" },
      { value: "completed", label: "Tamamlananlar" },
    ],
  },
  {
    id: "sort",
    value: "sort",
    label: "Tarihe Göre",
    icon: <Calendar />,
    options: [
      { value: "sort_newest", label: "Neueste" },
      { value: "sort_oldest", label: "Älteste" },
    ],
  },
];

export default function AdminEventsBoard() {
  const [aktifKategori, SetAktifKategori] = useState("Alle");
  const { data: categoriesResponse } = useEventCategories();
  const [inputValue, setInputValue] = useState("");
  const [sakinKelime] = useDebounce(inputValue, 400);

  const [seciliStatus, setSeciliStatus] = useState<string[]>([]);

  const [siralama, setSiralama] = useState<string>("sort_newest");

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data ||
      (categoriesResponse as any)?.categories ||
      [];
  const categoryNames = categories.map((cat: any) => cat.name);
  const benzersizkategoriler = ["Alle", ...categoryNames];

  const seciliKategoriObj = categories.find(
    (cat: any) => cat.name === aktifKategori,
  );
  const seciliKategoriId = seciliKategoriObj
    ? seciliKategoriObj._id
    : undefined;

  const onKategoriSec = (kategori: string) => {
    SetAktifKategori(kategori);
  };

  const pendingEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,

    siralama,
    kolonStatus: "pending",
    limit: 6,
  });

  const pendingEvents =
    pendingEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const approvedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "approved",
    limit: 6,
  });

  const approvedEvents =
    approvedEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const rejectedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "rejected",
    limit: 6,
  });

  const rejectedEvents =
    rejectedEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const cancelledEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "cancelled",
    limit: 6,
  });

  const cancelledEvents =
    cancelledEvent.data?.pages.flatMap((p) => p.events || []) || [];

  const completedEvent = useEventApplications({
    secilenKategori: seciliKategoriId,
    arananKelime: sakinKelime,
    seciliStatus: seciliStatus,
    siralama,
    kolonStatus: "completed",
    limit: 6,
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
    if (tiklananDeger.startsWith("sort_")) {
      setSiralama(tiklananDeger);
      return;
    }

    const varMi = seciliStatus.includes(tiklananDeger);
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
        title="Events"
        description="Verwalten Sie Events nach Status und behalten Sie den Veröffentlichungsablauf im Blick."
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 desktop:flex desktop:items-stretch desktop:overflow-x-auto">
          {/* pendıng*/}
          {(seciliStatus.length === 0 || seciliStatus.includes("pending")) && (
            <KanbanColumn
              scrollable
              title="Genehmigung ausstehend"
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
              scrollable
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
              scrollable
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
              scrollable
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
              scrollable
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
                Events werden geladen...
              </>
            ) : (
              <>
                <ArrowDown className="mr-2 h-5 w-5" />
                Weitere Events laden
              </>
            )}
          </Button>
        </div>
      )} */}
      <EventDrawer />
    </Card>
  );
}
