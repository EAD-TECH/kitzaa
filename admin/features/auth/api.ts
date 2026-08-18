import { apiFetch } from "@/lib/api/client";
import type { LoginResponse } from "./types/authTypes";

export async function refresh() {
  return apiFetch<LoginResponse>("/api/v1/auth/refresh", { method: "POST" });
}
