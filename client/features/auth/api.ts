import { apiFetch } from "@/lib/api/client";
import type { LoginPayload, LoginResponse } from "./types/authTypes";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function logout() {
  return apiFetch("/api/v1/auth/logout", {
    method: "POST",
  });
}
