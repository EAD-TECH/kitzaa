"use client";

import type { KanbanCardProps } from "@/components/shared/types";
import { OrganizerApplicationDTO } from "../types";
import { KanbanCard } from "@/components/shared/KanbanCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function OrganizerApplicationCard(application: {
  application: OrganizerApplicationDTO;
}) {
  const params = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();

  const handleCardClick = (clickedId: string) => {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set("applicationId", clickedId);
    router.push(`${pathname}?${currentParams.toString()}`);
  };
  let formattedDate = "Tarih yok";
  if (application.application?.createdAt) {
    const dateObj = new Date(application.application.createdAt);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });
    }
  }

  const cardData = {
    id: application.application._id,
    title: application.application.institutionData.name,
    category: application.application.institutionData.category,
    description: application.application.message,
    status: application.application.status,
    time: formattedDate,
    onClick: handleCardClick,
  } as KanbanCardProps;

  return (
    <>
      <KanbanCard data={cardData} />
    </>
  );
}
