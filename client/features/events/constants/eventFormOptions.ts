import type { AgeRange, EventLocationType } from "../types/event.types"

// uploadRouter.eventImage (server/src/configs/uploadthing.ts) ile birebir aynı limitler.
export const MAX_EVENT_IMAGES = 5
export const MAX_EVENT_IMAGE_SIZE_MB = 8

export const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "0-3", label: "0-3 Jahre" },
  { value: "4-6", label: "4-6 Jahre" },
  { value: "7-10", label: "7-10 Jahre" },
  { value: "10-14", label: "10-14 Jahre" },
  { value: "parents", label: "Für Eltern" },
  { value: "all-ages", label: "Alle Alter" },
]

export const LOCATION_TYPE_OPTIONS: { value: EventLocationType; label: string }[] = [
  { value: "indoor", label: "Drinnen" },
  { value: "outdoor", label: "Draußen" },
  { value: "online", label: "Online" },
]

export const CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "CHF", label: "CHF" },
]

export const RECURRENCE_OPTIONS = [
  { value: "weekly", label: "Wöchentlich" },
  { value: "monthly", label: "Monatlich" },
]
