import { apiFetch } from "@/lib/api/client";
import type {
  ListNotificationsResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  UnreadCountResponse,
} from "../types";

const BASE = "/api/v1/notifications";

/** GET / — listNotificationsById */
export async function listNotifications(params?: { isRead?: boolean }) {
  const search =
    params?.isRead === undefined ? "" : `?isRead=${String(params.isRead)}`;

  return apiFetch<ListNotificationsResponse>(`${BASE}${search}`, {
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
