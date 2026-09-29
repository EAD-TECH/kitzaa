import { apiFetch } from "@/lib/api/client";
import { buildPageQuery } from "@/lib/api/pagination";
import type {
  ListNotificationsResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  UnreadCountResponse,
} from "../types";

const BASE = "/api/v1/notifications";

/** GET / — listNotificationsById */
export async function listNotifications({
  page,
  isRead,
}: {
  page: number;
  isRead?: boolean;
}) {
  const search = buildPageQuery(page);
  if (isRead !== undefined) search.set("isRead", String(isRead));

  return apiFetch<ListNotificationsResponse>(`${BASE}?${search}`, {
    method: "GET",
  });
}

/** GET /unread-count */
export async function getUnreadNotificationCount() {
  return apiFetch<UnreadCountResponse>(`${BASE}/unread-count`, {
    method: "GET",
  });
}

/** PATCH /mark-all-read */
export async function markAllNotificationsAsRead() {
  return apiFetch<MarkAllNotificationsReadResponse>(`${BASE}/mark-all-read`, {
    method: "PATCH",
  });
}

/** PATCH /:id */
export async function markNotificationAsRead(id: string) {
  return apiFetch<MarkNotificationReadResponse>(`${BASE}/${id}`, {
    method: "PATCH",
  });
}
