import { useAuthStore } from "@/features/auth/store/authStore";
import type { LoginResponse } from "@/features/auth/types/authTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuthRefresh?: boolean; //eger bu req. 401 alirsa tekrar refresh akisina girme
  skipAuthHeaders?: boolean; //eger bu req. auth header'lari gondermemesi gerekiyorsa true yapilir.
};

type RefreshPromiseType = Promise<LoginResponse> | null;

let refreshPromise: RefreshPromiseType = null; //ayni anda birden fazla refresh istegi olmasini engellemek icin promise tutuluyor.

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  const accessToken = useAuthStore.getState().accessToken;
  const { body, headers: headersInit, skipAuthRefresh, skipAuthHeaders, ...rest } = options;
  const headers = new Headers(headersInit);

  headers.set("Content-Type", "application/json");

  if (accessToken && !skipAuthHeaders) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    // sunucuya hiç ulaşılamadı (internet yok, backend ayakta değil vs.) — kullanıcının hatası değil
    console.error(`Network error on ${path}`, err);
    throw new ApiError("Server konnte nicht erreicht werden. Bitte überprüfe deine Verbindung.", 0);
  }

  if (!res.ok) {
    // 5xx: backend'in ham mesajını kullanıcıya sızdırma, sadece logla
    if (res.status >= 500) {
      console.error(`API ${res.status} error on ${path}`);
      throw new ApiError("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.", res.status);
    }

    if (res.status === 401 && accessToken && !skipAuthRefresh && !skipAuthHeaders) {
      try {
        if (!refreshPromise) {
          refreshPromise = apiFetch<LoginResponse>("/api/v1/auth/refresh", {
            method: "POST",
            skipAuthRefresh: true, // sonsuz refresh döngüsünü engeller
            skipAuthHeaders: true, // Bearer göndermez
          });
        }

        const refreshResponse = await refreshPromise;

        useAuthStore.getState().setAccessToken(refreshResponse.accessToken);

        return apiFetch<T>(path, {
          ...options,
          skipAuthRefresh: true,
        });
      } catch {
        useAuthStore.getState().setAccessToken(null);

        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }

        throw new ApiError("Session expired. Please log in again.", 401);
      } finally {
        refreshPromise = null;
      }
    }

    // 4xx: backend'in ürettiği anlamlı mesajı kullan
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(errorBody?.message ?? "Request failed", res.status);
  }

  // 204 No Content'te body yok — res.json() boş string'i parse edemeyip hata fırlatır
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
