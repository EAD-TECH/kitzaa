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
  secilenKategori: string | undefined;
  page?:number
  limit?:number
}

export async function listOrganizerApplications({
  secilenKategori,
  page,
  limit
}: ListOrganizerApplicationsParams): Promise<ListOrganizerApplicationsResponse> {
  const params=new URLSearchParams()

  if (secilenKategori && secilenKategori != "Tümü") {
    params.append("category",secilenKategori)
    
  }if(page) { 
    params.append("page",page.toString())
  }if (limit) {
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

