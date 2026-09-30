import type { EventDTO } from "../types/event.types"

export const AGE_RANGE_LABELS: Record<EventDTO["ageRange"], string> = {
  "0-3": "0-3 Jahre",
  "4-6": "4-6 Jahre",
  "7-10": "7-10 Jahre",
  "10-14": "10-14 Jahre",
  parents: "Für Eltern",
  "all-ages": "Alle Alter",
}

export function formatAgeRange(ageRange: EventDTO["ageRange"]) {
  return AGE_RANGE_LABELS[ageRange]
}
