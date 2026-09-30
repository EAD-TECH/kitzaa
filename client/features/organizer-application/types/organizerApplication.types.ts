export const APPLICATION_STATUSES = [
  "pending",
  "under_review",
  "approved",
  "rejected",
  "needs_more_info",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const REVIEWER_TYPES = ["admin", "ai", "system"] as const;
export type ReviewerType = (typeof REVIEWER_TYPES)[number];

export interface InstitutionDataDTO {
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
}

export interface StatusHistoryDTO {
  status: ApplicationStatus;
  changedBy: string | null;
  changedAt: string;
  note?: string | null;
}

export interface OrganizerApplicationDTO {
  _id: string;
  userId: string;
  institutionData: InstitutionDataDTO;
  message: string | null;
  status: ApplicationStatus;
  reviewedBy: string | null;
  reviewerType: ReviewerType | null;
  rejectedReason: string | null;
  reviewedAt: string | null;
  statusHistory: StatusHistoryDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplyOrganizerResponse {
  error: false;
  message: string;
  application: OrganizerApplicationDTO;
}

export interface GetMyOrganizerApplicationsResponse {
  error: false;
  applications: OrganizerApplicationDTO[];
}
