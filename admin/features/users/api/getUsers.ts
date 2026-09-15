import { apiFetch } from "@/lib/api/client";
import { ListAdminUsersResponse } from "../types/users.types";


const BASE = "/api/v1/admin/users";

export async function listAdminUsers(): Promise<ListAdminUsersResponse> {
  return apiFetch<ListAdminUsersResponse>(BASE, { method: "GET" });
}