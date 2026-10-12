import type { AgeRange } from "../types/event.types"

type Translate = (key: string) => string

const AGE_RANGE_KEYS: Record<AgeRange, string> = {
  "0-3": "age0to3",
  "4-6": "age4to6",
  "7-10": "age7to10",
  "10-14": "age10to14",
  parents: "ageParents",
  "all-ages": "ageAll",
}

const AGE_RANGE_ORDER = Object.keys(AGE_RANGE_KEYS) as AgeRange[]

export function sortAgeRanges(ageRanges: readonly AgeRange[]): AgeRange[] {
  return [...ageRanges].sort((a, b) => AGE_RANGE_ORDER.indexOf(a) - AGE_RANGE_ORDER.indexOf(b))
}

export function formatAgeRanges(
  ageRanges: readonly AgeRange[] | null | undefined,
  t: Translate,
) {
  if (!ageRanges?.length) return t("ageNotSpecified")
  return sortAgeRanges(ageRanges)
    .map((range) => t(AGE_RANGE_KEYS[range]))
    .join(", ")
}
