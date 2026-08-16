import { useAuthStore } from "@/features/auth/store/authStore";

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
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  const accessToken = useAuthStore.getState().accessToken;
  const { body, headers: headersInit, ...rest } = options;
  const headers = new Headers(headersInit);

  headers.set("Content-Type", "application/json");

  if (accessToken) {
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
