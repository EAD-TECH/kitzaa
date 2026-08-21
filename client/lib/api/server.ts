

import { ApiError } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiFetchServerOptions = Omit<RequestInit, "body" | "cache"> & {
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
};

export async function apiFetchServer<T>(
  path: string,
  options: ApiFetchServerOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  const { body, revalidate, tags, headers: headersInit, ...rest } = options;
  const headers = new Headers(headersInit);
  headers.set("Content-Type", "application/json");

  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      next: { revalidate, tags },
    });
  } catch (err) {
    console.error(`Network error on ${path}`, err);
    throw new ApiError("Server konnte nicht erreicht werden.", 0);
  }

  if (!res.ok) {
    if (res.status >= 500) {
      console.error(`API ${res.status} error on ${path}`);
      throw new ApiError("Ein Fehler ist aufgetreten.", res.status);
    }

    const errorBody = await res.json().catch(() => null);
    throw new ApiError(errorBody?.message ?? "Request failed", res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
