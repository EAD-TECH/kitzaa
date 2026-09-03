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
    skipAuthRefresh: true,
    skipAuthHeaders: true,
  });
}

export async function logout() {
  return apiFetch("/api/v1/auth/logout", {
    method: "POST",
    skipAuthRefresh: true,
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<RegisterResponse>("/api/v1/auth/register", { 
    method: "POST", 
    body: payload,
    skipAuthRefresh: true,
    skipAuthHeaders: true,
   });
}

export async function verifyEmail(token: string) {
  return apiFetch<LoginResponse>(`/api/v1/auth/verify-email/${token}`, { 
    method: "GET",
    skipAuthRefresh: true,
    skipAuthHeaders: true,
  });
}

//skipAuthRefresh: true parametresi, refresh token ile access token alinirken, eger refresh token gecersiz ise otomatik olarak logout islemi yapilmasini engeller. Bu sayede kullaniciya daha iyi bir deneyim sunulur ve gereksiz logout islemleri onlenir.

export async function refresh() {
  return apiFetch<LoginResponse>("/api/v1/auth/refresh", {
     method: "POST", 
     skipAuthRefresh: true,
     skipAuthHeaders: true,
  });
}

export async function forgotPassword(payload: ForgotPasswordValues){
  return apiFetch<ForgotPasswordResponse>("/api/v1/auth/forgot-password", { 
    method: "POST",
    body: payload,
    skipAuthRefresh: true,
    skipAuthHeaders: true,
  });
}

export async function resetPassword(token: string, payload: ResetPasswordValues){
  return apiFetch<ResetPasswordResponse>(`/api/v1/auth/reset-password/${token}`, { 
    method: "POST",
    body: payload,
    skipAuthRefresh: true,
    skipAuthHeaders: true,
  });
}
