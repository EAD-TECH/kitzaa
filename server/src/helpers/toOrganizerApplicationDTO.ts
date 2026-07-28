import type {
  OrganizerApplicationDocument,
  OrganizerApplicationDTO,
  StatusHistoryDTO,
} from "../types/organizerApplication.types.js";
import type { Types } from "mongoose";

function toObjectIdString(value?: Types.ObjectId | null): string | null {
  return value ? value.toString() : null;
}

function toStatusHistoryDTO(
  history: OrganizerApplicationDocument["statusHistory"],
): StatusHistoryDTO[] {
  return history.map((entry) => ({
    status: entry.status,
    changedBy: toObjectIdString(entry.changedBy),
    changedAt: entry.changedAt,
    note: entry.note ?? null,
  }));
}

export function toOrganizerApplicationDTO(
  application: OrganizerApplicationDocument,
): OrganizerApplicationDTO;
export function toOrganizerApplicationDTO(
  application: OrganizerApplicationDocument[],
): OrganizerApplicationDTO[];
export function toOrganizerApplicationDTO(
  application: OrganizerApplicationDocument | OrganizerApplicationDocument[] | null,
): OrganizerApplicationDTO | OrganizerApplicationDTO[] | null;

export function toOrganizerApplicationDTO(
  application: OrganizerApplicationDocument | OrganizerApplicationDocument[] | null,
): OrganizerApplicationDTO | OrganizerApplicationDTO[] | null {
  if (!application) return null;

  if (Array.isArray(application)) {
    return application.map((item) => toOrganizerApplicationDTO(item));
  }

  return {
    _id: application._id.toString(),
    userId: application.userId.toString(),
    institutionData: {
      name: application.institutionData.name,
      description: application.institutionData.description ?? null,
      address: application.institutionData.address ?? null,
      phone: application.institutionData.phone ?? null,
      website: application.institutionData.website ?? null,
      category: application.institutionData.category ?? null,
    },
    message: application.message ?? null,
    status: application.status,
    reviewedBy: toObjectIdString(application.reviewedBy),
    reviewerType: application.reviewerType ?? null,
    rejectedReason: application.rejectedReason ?? null,
    reviewedAt: application.reviewedAt ?? null,
    statusHistory: toStatusHistoryDTO(application.statusHistory),
    createdAt: application.createdAt!,
    updatedAt: application.updatedAt!,
  };
}
