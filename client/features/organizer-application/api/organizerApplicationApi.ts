import { apiFetch } from "@/lib/api/client";
import type {
  ApplyOrganizerResponse,
  GetMyOrganizerApplicationsResponse,
} from "../types/organizerApplication.types";
import type { ApplyOrganizerInput } from "../validations/organizerApplication.schema";

export const createOrganizerApplication = async (payload: ApplyOrganizerInput) => {
  return apiFetch<ApplyOrganizerResponse>(`/api/v1/organizer-applications`, {
    method: "POST",
    body: payload,
  });
};

export const getMyOrganizerApplications = async () => {
  return apiFetch<GetMyOrganizerApplicationsResponse>(`/api/v1/organizer-applications/me`);
};
