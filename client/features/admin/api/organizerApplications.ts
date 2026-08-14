import { apiFetch } from "@/lib/api/client";
import type {
  ApproveOrganizerApplicationResponse,
  GetOrganizerApplicationResponse,
  ListOrganizerApplicationsResponse,
  RejectApplicationBody,
  RejectOrganizerApplicationResponse,
} from "../types";

const BASE = "/api/v1/admin/organizer-applications";

/** GET / — admin.organizerApplicationController.list */
export async function listOrganizerApplications() {
  return apiFetch<ListOrganizerApplicationsResponse>(BASE, { method: "GET" });
}

/** GET /:id — read */
export async function getOrganizerApplication(id: string) {
  return apiFetch<GetOrganizerApplicationResponse>(`${BASE}/${id}`, {
    method: "GET",
  });
}

/** PUT /:id/approve — no body */
export async function approveOrganizerApplication(id: string) {
  return apiFetch<ApproveOrganizerApplicationResponse>(`${BASE}/${id}/approve`, {
    method: "PUT",
  });
}

/** PUT /:id/reject — { rejectedReason } */
export async function rejectOrganizerApplication(
  id: string,
  body: RejectApplicationBody,
) {
  return apiFetch<RejectOrganizerApplicationResponse>(`${BASE}/${id}/reject`, {
    method: "PUT",
    body,
  });
}
