import { apiFetch } from "@/lib/api/client";
import type {
  ApproveOrganizerApplicationResponse,
  GetOrganizerApplicationResponse,
  ListOrganizerApplicationsResponse,
  RejectApplicationBody,
  RejectOrganizerApplicationResponse,
} from "../types";

const BASE = "/api/v1/admin/organizer-applications";

interface ListOrganizerApplicationsParams {
  arananKelime: string | undefined;
  seciliStatus?: string[];
  siralama?: string;
  page?: number;
  limit?: number;
}

export async function listOrganizerApplications({
  arananKelime,
  seciliStatus,
  siralama,
  page,
  limit,
}: ListOrganizerApplicationsParams): Promise<ListOrganizerApplicationsResponse> {
  const params = new URLSearchParams();

  if (siralama === "sort_oldest") {
    params.append("sort[createdAt]", "1");
  } else {
    params.append("sort[createdAt]", "-1");
  }

  if (arananKelime) {
    params.append("search[institutionData.name]", arananKelime);
  }
  if (seciliStatus && seciliStatus.length > 0) {
    seciliStatus.forEach((durum) => params.append("filter[status]", durum));
  }
  if (page) {
    params.append("page", page.toString());
  }
  if (limit) {
    params.append("limit", limit.toString());
  }
  const queryString = params.toString();

  const endpoint = queryString ? `${BASE}?${queryString}` : BASE;

  return apiFetch<ListOrganizerApplicationsResponse>(endpoint, {
    method: "GET",
  });
}

export async function getOrganizerApplication(id: string) {
  return apiFetch<GetOrganizerApplicationResponse>(`${BASE}/${id}`, {
    method: "GET",
  });
}

export async function approveOrganizerApplication(id: string) {
  return apiFetch<ApproveOrganizerApplicationResponse>(
    `${BASE}/${id}/approve`,
    {
      method: "PUT",
    },
  );
}

export async function rejectOrganizerApplication(
  id: string,
  body: RejectApplicationBody,
) {
  return apiFetch<RejectOrganizerApplicationResponse>(`${BASE}/${id}/reject`, {
    method: "PUT",
    body,
  });
}
