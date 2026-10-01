import type { AgeRange } from "../types/event.types"

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  "0-3": "0-3 Jahre",
  "4-6": "4-6 Jahre",
  "7-10": "7-10 Jahre",
  "10-14": "10-14 Jahre",
  parents: "Für Eltern",
  "all-ages": "Alle Alter",
}

// Etiket listesinde de seçim sırası değil, sabit (küçükten büyüğe) sıra kullanılsın.
const AGE_RANGE_ORDER = Object.keys(AGE_RANGE_LABELS) as AgeRange[]

export function sortAgeRanges(ageRanges: readonly AgeRange[]): AgeRange[] {
  return [...ageRanges].sort((a, b) => AGE_RANGE_ORDER.indexOf(a) - AGE_RANGE_ORDER.indexOf(b))
}

export function formatAgeRange(ageRange: AgeRange) {
  return AGE_RANGE_LABELS[ageRange]
}

// ["4-6", "7-10"] -> "4-6 Jahre, 7-10 Jahre". Boş/eksik dizi "Alle Alter" diye gösterilmez —
// eksik veriyi gerçek bir değer gibi göstermek yanıltıcı olur.
export function formatAgeRanges(ageRanges: readonly AgeRange[] | null | undefined) {
  if (!ageRanges?.length) return "Nicht angegeben"
  return sortAgeRanges(ageRanges).map(formatAgeRange).join(", ")
}
