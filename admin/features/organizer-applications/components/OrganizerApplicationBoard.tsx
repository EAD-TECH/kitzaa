"use client";

import FilterAndSearch from "@/components/shared/FilterAndSearch";
import KanbanColumn from "@/components/shared/KanbanColumn";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import OrganizerApplicationCard from "./OrganizerApplicationCard";
import { useOrganizerApplications } from "../hooks/useOrganizerApplications";
import KanbanSkeleton from "@/components/shared/KanbanSkeleton";
import KanbanErrorState from "@/components/shared/KanbanErrorState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CircleIcon, UserIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import ReusableDrawer from "@/components/shared/drawer/ReusableDrawer";

const filtreSecenekleri = [
  {
    id: "status",
    value: "status",
    label: "Status",
    icon: <CircleIcon />,
    options: [
      { value: "pending", label: "Neue Anträge" },
      { value: "under_review", label: "In Prüfung" },
      { value: "approved", label: "Genehmigt" },
      { value: "rejected", label: "Abgelehnt" },
    ],
  },
  {
    id: "assignee",
    value: "assignee",
    label: "Zuständige Person",
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
    label: "Nach Datum",
    icon: <Calendar />,
    options: [
      { value: "sort_newest", label: "Neueste zuerst" },
      { value: "sort_oldest", label: "Älteste zuerst" },
    ],
  },
];

export default function OrganizerApplicationBoard() {
  const [inputValue, setInputValue] = useState("");
  const [sakinKelime] = useDebounce(inputValue, 400);
  const [seciliStatus, setSeciliStatus] = useState<string[]>([]);
  const [siralama, setSiralama] = useState<string>("sort_newest");

  /*  // pendıng*/
  const pendingEvent = useOrganizerApplications({
    arananKelime: sakinKelime,
    seciliStatus,
    siralama,
    kolonStatus: "pending",
    limit: 6,
  });
  const pendingEvents =
    pendingEvent.data?.pages.flatMap((p) => p.applications || []) || [];

  /* incelemede */
  const underReviewEvent = useOrganizerApplications({
    arananKelime: sakinKelime,
    seciliStatus,
    siralama,
    kolonStatus: "under_review",
    limit: 6,
  });
  const underReviewEvents =
    underReviewEvent.data?.pages.flatMap((p) => p.applications || []) || [];

  /* approved */
  const approvedEvent = useOrganizerApplications({
    arananKelime: sakinKelime,
    seciliStatus,
    siralama,
    kolonStatus: "approved",
    limit: 6,
  });
  const approvedEvents =
    approvedEvent.data?.pages.flatMap((p) => p.applications || []) || [];

  /* rejected */
  const rejectedEvent = useOrganizerApplications({
    arananKelime: sakinKelime,
    seciliStatus,
    siralama,
    kolonStatus: "rejected",
    limit: 6,
  });
  const rejectedEvents =
    rejectedEvent.data?.pages.flatMap((p) => p.applications || []) || [];
  /* ortak yukleme ve hata durumu */
  const isLoading =
    pendingEvent.isLoading ||
    underReviewEvent.isLoading ||
    approvedEvent.isLoading ||
    rejectedEvent.isLoading;
  const isError =
    pendingEvent.isError ||
    underReviewEvent.isError ||
    approvedEvent.isError ||
    rejectedEvent.isError;

  /* fılter */
  const onFilterSelect = (tiklananDeger: string) => {
    if (tiklananDeger.startsWith("sort_")) {
      setSiralama(tiklananDeger);
      return;
    }

    const gercekStatusler = ["pending", "under_review", "approved", "rejected"];
    if (gercekStatusler.includes(tiklananDeger)) {
      const varMi = seciliStatus.includes(tiklananDeger);
      if (varMi) {
        setSeciliStatus(
          seciliStatus.filter((deger) => deger !== tiklananDeger),
        );
      } else {
        setSeciliStatus([...seciliStatus, tiklananDeger]);
      }
    } else {
      console.log("Kişi seçildi, tahta silinmeyecek!"); // Assignee bug'ı çözümü
    }
  };

  return (
    <Card className="flex flex-col gap-6 self-stretch rounded-2xl border border-border bg-background p-6 ring-0 shadow-none">
      {/* BAŞLIK VE FİLTRELER */}
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
        <PageHeader
          title="Organisatoranträge"
          description="Verwalte die eingegangenen Anträge"
        />

        <div className="flex w-full flex-wrap items-center gap-2 desktop:w-fit">
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
              onClick={() => {
                setSeciliStatus([]);
                setSiralama("sort_newest");
              }}
            >
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>

      {isLoading && <KanbanSkeleton />}

      {!isLoading && isError && (
        <KanbanErrorState
          onRetry={() => {
            pendingEvent.refetch();
            underReviewEvent.refetch();
            approvedEvent.refetch();
            rejectedEvent.refetch();
          }}
        />
      )}

      {/* --- KANBAN KOLONLARI --- */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 desktop:flex desktop:items-stretch desktop:overflow-x-auto">
          {/* 1. YENİ */}
          {(seciliStatus.length === 0 || seciliStatus.includes("pending")) && (
            <KanbanColumn
              scrollable
              title="Neu"
              count={pendingEvents.length}
              dotColor="bg-yellow-500"
              fetchNextPage={pendingEvent.fetchNextPage}
              hasNextPage={pendingEvent.hasNextPage}
              isFetchingNextPage={pendingEvent.isFetchingNextPage}
            >
              {pendingEvents.map((basvuru) => (
                <OrganizerApplicationCard
                  key={basvuru._id}
                  application={basvuru}
                />
              ))}
            </KanbanColumn>
          )}

          {/* 2. İNCELEMEDE */}
          {(seciliStatus.length === 0 ||
            seciliStatus.includes("under_review")) && (
            <KanbanColumn
              scrollable
              title="In Prüfung"
              count={underReviewEvents.length}
              dotColor="bg-blue-500"
              fetchNextPage={underReviewEvent.fetchNextPage}
              hasNextPage={underReviewEvent.hasNextPage}
              isFetchingNextPage={underReviewEvent.isFetchingNextPage}
            >
              {underReviewEvents.map((basvuru) => (
                <OrganizerApplicationCard
                  key={basvuru._id}
                  application={basvuru}
                />
              ))}
            </KanbanColumn>
          )}

          {/* 3. ONAYLANDI */}
          {(seciliStatus.length === 0 || seciliStatus.includes("approved")) && (
            <KanbanColumn
              scrollable
              title="Genehmigt"
              count={approvedEvents.length}
              dotColor="bg-green-500"
              fetchNextPage={approvedEvent.fetchNextPage}
              hasNextPage={approvedEvent.hasNextPage}
              isFetchingNextPage={approvedEvent.isFetchingNextPage}
            >
              {approvedEvents.map((basvuru) => (
                <OrganizerApplicationCard
                  key={basvuru._id}
                  application={basvuru}
                />
              ))}
            </KanbanColumn>
          )}

          {/* 4. REDDEDİLDİ */}
          {(seciliStatus.length === 0 || seciliStatus.includes("rejected")) && (
            <KanbanColumn
              scrollable
              title="Abgelehnt"
              count={rejectedEvents.length}
              dotColor="bg-red-500"
              fetchNextPage={rejectedEvent.fetchNextPage}
              hasNextPage={rejectedEvent.hasNextPage}
              isFetchingNextPage={rejectedEvent.isFetchingNextPage}
            >
              {rejectedEvents.map((basvuru) => (
                <OrganizerApplicationCard
                  key={basvuru._id}
                  application={basvuru}
                />
              ))}
            </KanbanColumn>
          )}
        </div>
      )}

      <ReusableDrawer />
    </Card>
  );
}
