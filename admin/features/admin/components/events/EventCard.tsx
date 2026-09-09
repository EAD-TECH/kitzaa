"use client";

import { KanbanCardProps } from "@/components/shared/types";
import { AdminEventDTO } from "../../types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { KanbanCard } from "@/components/shared/KanbanCard";

function EventCard(application: { application: AdminEventDTO }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCardClick = (clickedId: string) => {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set("applicationId", clickedId);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  /*  tarihi formatlıyorm */
  let formattedDate = "Tarih yok";

  if (application.application?.schedule?.startDate) {
    const dateObj = new Date(application.application.schedule.startDate);

    /* invalid hatasına karsı */
    if (!isNaN(dateObj.getTime())) {
      const dayMonth = dateObj.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });

      const timeStr = application.application.schedule.startTime
        ? ` • ${application.application.schedule.startTime}${
            application.application.schedule.endTime
              ? ` - ${application.application.schedule.endTime}`
              : ""
          }`
        : "";

      const recurringBadge = application.application.schedule.isRecurring
        ? " (Tekrarlı)"
        : "";

      formattedDate = `${dayMonth}${timeStr}${recurringBadge}`;
    }
  }

  const capacityCurrent = application.application.capacity.current;
  const capacityMax = application.application.capacity.max;
  const fillPercentage =
    capacityMax > 0 ? Math.round((capacityCurrent / capacityMax) * 100) : 0;

  // 2. KART VERİSİNİ HAZIRLAMA
  const cardData = {
    id: application.application._id,
    title: application.application.title,
    category:
      typeof application.application.categoryId === "string"
        ? undefined
        : application.application.categoryId.name,
    description: application.application.description,
    status: application.application.status,
    time: formattedDate,
    onClick: handleCardClick,
    progressPercentage: fillPercentage,
  } as KanbanCardProps;

  return <KanbanCard data={cardData} />;
}

export default EventCard;
