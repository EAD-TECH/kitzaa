import type { AiEventSearchOutput } from "../../validations/ai/ai-event-search-output.validation.js";

export const getMissingRequiredField = (filters: AiEventSearchOutput) => {
    
  if (filters.childAges === null || filters.childAges.length === 0) {
    return "childAges";
  }

  if (filters.datePreference === null) {
    return "datePreference";
  }

  if (filters.datePreference === "specific" && filters.specificDate == null) {
    return "specificDate";
  }

  if (filters.cities === null || filters.cities.length === 0) {
    return "cities";
  }

  return null;
};