import { apiFetch } from "@/lib/api/client";
import type { CancelEventBody, RejectEventBody } from "../types";

const BASE = "/api/v1/admin/events";

/** Placeholder — admin events module */

export async function listAdminEvents() {
  return apiFetch(BASE, { method: "GET" });
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
