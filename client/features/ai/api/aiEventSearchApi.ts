import { apiFetch } from "@/lib/api/client";
import type { AiEventSearchRequest, AiEventSearchResponse } from "../types/aiEventSearch.types";

export const aiEventSearch = async (payload: AiEventSearchRequest) => {
  return apiFetch<AiEventSearchResponse>(`/api/v1/ai/event-search`, {
    method: "POST",
    body: payload,
  });
};
