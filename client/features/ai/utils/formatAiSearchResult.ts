import type { AiEventSearchFilters } from "../types/aiEventSearch.types";

export type AiFilterChip =
  | { kind: "childAges"; value: number[] }
  | { kind: "city"; value: string }
  | { kind: "date"; value: Exclude<AiEventSearchFilters["datePreference"], "specific" | "any" | null> }
  | { kind: "specificDate"; value: string }
  | { kind: "maxPrice"; value: number }
  | { kind: "environment"; value: "indoor" | "outdoor" | "online" }
  | { kind: "time"; value: "morning" | "afternoon" | "evening" };

// "any" ve null kullanıcının bir tercih belirtmediği anlamına gelir — çip olarak gösterilmez.
export function getFilterChips(filters: AiEventSearchFilters): AiFilterChip[] {
  const chips: AiFilterChip[] = [];

  if (filters.childAges !== null) {
    chips.push({
      kind: "childAges",
      value: [...new Set(filters.childAges)].sort((a, b) => a - b),
    });
  }

  const cities = new Set(
    (filters.cities ?? [])
      .map((city) => city.trim())
      .filter((city) => city.length > 0 && city.toLowerCase() !== "any"),
  );
  cities.forEach((city) => chips.push({ kind: "city", value: city }));

  if (filters.datePreference === "specific" && filters.specificDate) {
    chips.push({ kind: "specificDate", value: filters.specificDate });
  } else if (
    filters.datePreference === "today" ||
    filters.datePreference === "tomorrow" ||
    filters.datePreference === "weekend" ||
    filters.datePreference === "thisMonth"
  ) {
    chips.push({ kind: "date", value: filters.datePreference });
  }

  if (filters.maxPrice !== null) {
    chips.push({ kind: "maxPrice", value: filters.maxPrice });
  }

  if (
    filters.environment === "indoor" ||
    filters.environment === "outdoor" ||
    filters.environment === "online"
  ) {
    chips.push({ kind: "environment", value: filters.environment });
  }

  if (filters.timePreference && filters.timePreference !== "any") {
    chips.push({ kind: "time", value: filters.timePreference });
  }

  return chips;
}

// specificDate "YYYY-MM-DD" olarak gelir; new Date("YYYY-MM-DD") UTC gece yarısı sayıldığı için
// yerel saat dilimine göre bir gün kayabilir, bu yüzden parçalardan yerel tarih kurulur.
export function formatSpecificDate(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}
