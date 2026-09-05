import type { KanbanCardProps } from "@/components/shared/types";
import { OrganizerApplicationDTO } from "../../types";
import { KanbanCard } from "@/components/shared/KanbanCard";

export default function OrganizerApplicationCard(application: {
  application: OrganizerApplicationDTO;
}) {
  const cardData = {
    id: application.application._id,
    title: application.application.institutionData.name,
    category: application.application.institutionData.category,
    description: application.application.message,
    status: application.application.status,
    time: application.application.createdAt.toString(),
  } as KanbanCardProps;

  return (
    <>
      <KanbanCard data={cardData} />
    </>
  );
}
