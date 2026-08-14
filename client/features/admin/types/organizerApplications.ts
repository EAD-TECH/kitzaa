export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export type ReviewerType = "admin" | "ai" | "system";

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
  /** ISO date string from JSON */
  changedAt: string;
  note?: string | null;
}

/** Matches backend toOrganizerApplicationDTO (JSON wire format). */
export interface OrganizerApplicationDTO {
  _id: string;
  userId: string;
  institutionData: InstitutionDataDTO;
  message: string | null;
  status: ApplicationStatus;
  reviewedBy: string | null;
  reviewerType: ReviewerType | null;
  rejectedReason: string | null;
  /** ISO date string from JSON */
  reviewedAt: string | null;
  statusHistory: StatusHistoryDTO[];
  createdAt: string;
  updatedAt: string;
}

/** Partial institution object returned by admin approve. */
export interface ApprovedInstitutionSummary {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  applicationId: string;
  status: "active" | "suspended";
}

export interface RejectApplicationBody {
  rejectedReason: string;
}

/** GET /admin/organizer-applications */
export interface ListOrganizerApplicationsResponse {
  error: false;
  details: unknown;
  applications: OrganizerApplicationDTO[];
}

/** GET /admin/organizer-applications/:id */
export interface GetOrganizerApplicationResponse {
  error: false;
  application: OrganizerApplicationDTO;
}

/** PUT /admin/organizer-applications/:id/approve */
export interface ApproveOrganizerApplicationResponse {
  error: false;
  message: string;
  application: OrganizerApplicationDTO;
  institution: ApprovedInstitutionSummary;
}

/** PUT /admin/organizer-applications/:id/reject */
export interface RejectOrganizerApplicationResponse {
  error: false;
  message: string;
  application: OrganizerApplicationDTO;
}
