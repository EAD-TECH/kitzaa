import type { EventDTO } from "@/features/events/types/event.types";

// server/src/validations/ai/ai-event-search-output.validation.ts ile aynı şekil
export interface AiEventSearchFilters {
  childAges: number[] | null;
  datePreference: "today" | "tomorrow" | "weekend" | "thisMonth" | "specific" | "any" | null;
  specificDate: string | null;
  environment: "indoor" | "outdoor" | "online" | "any" | null;
  timePreference: "morning" | "afternoon" | "evening" | "any" | null;
  cities: string[] | null;
  maxPrice: number | null;
}

// server/src/helpers/ai/getMissingRequiredField.ts
export type AiMissingField = "childAges" | "datePreference" | "specificDate" | "cities";

export interface AiEventSearchRequest {
  message: string;
  conversationId?: string;
}

export interface AiEventSearchQuestionResponse {
  type: "question";
  conversationId: string;
  missingField: AiMissingField;
  filters: AiEventSearchFilters;
}

export interface AiEventSearchReadyResponse {
  type: "ready";
  conversationId: string;
  filters: AiEventSearchFilters;
  events: EventDTO[];
}

export type AiEventSearchResponse = AiEventSearchQuestionResponse | AiEventSearchReadyResponse;
