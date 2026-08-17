import { apiFetch } from "@/lib/api/client";
import type { 
  ForgotPasswordResponse,
  LoginPayload, 
  LoginResponse, 
  RegisterResponse, 
  ResetPasswordResponse
} from "./types/authTypes";
import type { RegisterPayload } from "./validations/register.schema";
import type { ForgotPasswordValues } from "./validations/forgotpassword.schema";
import type { ResetPasswordValues } from "./validations/resetpassword.schema";

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

export async function register(payload: RegisterPayload) {
  return apiFetch<RegisterResponse>("/api/v1/auth/register", { method: "POST", body: payload });
}

export async function verifyEmail(token: string) {
  return apiFetch<LoginResponse>("api/v1/auth/verify-email/${token}", { method: "GET" });
}

export async function refresh() {
  return apiFetch<LoginResponse>("/api/v1/auth/refresh", { method: "POST" });
}

export async function forgotPassword(payload: ForgotPasswordValues){
  return apiFetch<ForgotPasswordResponse>("/api/v1/auth/forgot-password", { 
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(token: string, payload: ResetPasswordValues){
  return apiFetch<ResetPasswordResponse>(`/api/v1/auth/reset-password/${token}`, { 
    method: "POST",
    body: payload,
  });
}
