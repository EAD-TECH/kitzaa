import type { AgeRange, EventLocationType } from "../types/event.types"

// uploadRouter.eventImage (server/src/configs/uploadthing.ts) ile birebir aynı limitler.
export const MAX_EVENT_IMAGES = 5
export const MAX_EVENT_IMAGE_SIZE_MB = 8

export const AGE_RANGE_VALUES: AgeRange[] = ["0-3", "4-6", "7-10", "10-14", "parents", "all-ages"]

export const LOCATION_TYPE_VALUES: EventLocationType[] = ["indoor", "outdoor", "online"]

export const CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "CHF", label: "CHF" },
]

export const RECURRENCE_VALUES = ["weekly", "monthly"] as const
