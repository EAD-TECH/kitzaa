import { apiFetch } from "@/lib/api/client";
import type {
  CancelEventBody,
  ListAdminEventsResponse,
  RejectEventBody,
} from "../types";

const BASE = "/api/v1/admin/events";
const categoriUrl = "/api/v1/category";

interface ListAdminEventsParams {
  secilenKategori?: string;
  arananKelime?: string;
  seciliStatus?: string[];
  siralama?: string;
  page?: number;
  limit?: number;
}
export async function listAdminEvents({
  secilenKategori,
  arananKelime,
  seciliStatus,
  siralama,
  page,
  limit = 6,
}: ListAdminEventsParams = {}): Promise<ListAdminEventsResponse> {
  const params = new URLSearchParams();

  if (siralama === "sort_oldest") {
    params.append("sort[schedule.startDate]", "1");
  } else {
    params.append("sort[schedule.startDate]", "-1");
  }

  if (secilenKategori && secilenKategori !== "Tümü") {
    params.append("filter[categoryId]", secilenKategori);
  }
  if (arananKelime) {
    params.append("search[title]", arananKelime);
  }
  if (seciliStatus && seciliStatus.length > 0) {
    seciliStatus.forEach((durum) => params.append("filter[status]", durum));
  }

  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  const qs = params.toString();
  return apiFetch<ListAdminEventsResponse>(qs ? `${BASE}?${qs}` : BASE, {
    method: "GET",
  });
}

export async function getAdminEvent(id: string) {
  return apiFetch(`${BASE}/${id}`, { method: "GET" });
}

export async function approveAdminEvent(id: string) {
  return apiFetch(`${BASE}/${id}/approve`, { method: "PUT" });
}

export async function rejectAdminEvent(id: string, body: RejectEventBody) {
  return apiFetch(`${BASE}/${id}/reject`, { method: "PUT", body });
}

export async function cancelAdminEvent(id: string, body: CancelEventBody) {
  return apiFetch(`${BASE}/${id}/cancel`, { method: "PUT", body });
}

export async function deleteAdminEvent(id: string) {
  return apiFetch(`${BASE}/${id}`, { method: "DELETE" });
}
export async function getEventCategories() {
  return apiFetch(`${categoriUrl}`, { method: "GET" });
}
