"use client"

import React from 'react'
import type { AgeRange } from '../types/event.types';
import { useQueryParams } from '../hooks/useQueryParams';
import { useTranslations } from "next-intl"
import { cn } from '@/lib/utils';


const AGE_RANGES: { value: AgeRange; labelKey: "age0to3" | "age4to6" | "age7to10" | "age10to14" | "ageParents" }[] = [
  { value: "0-3", labelKey: "age0to3" },
  { value: "4-6", labelKey: "age4to6" },
  { value: "7-10", labelKey: "age7to10" },
  { value: "10-14", labelKey: "age10to14" },
  { value: "parents", labelKey: "ageParents" },
]

const AgeFilter = () => {
  const t = useTranslations("Events")
  const { getParam, setParam } = useQueryParams()
  const selected = getParam("ageRange")

  return (
    <div className='flex flex-wrap gap-x-4 gap-y-2 mt-6'>
      <button
        onClick={() => setParam("ageRange", null)}
        className={cn(
          'bg-popover/40 py-1.5 px-4 rounded-4xl text-sm border hover:bg-secondary/90 hover:text-secondary-foreground cursor-pointer transition-colors duration-200 ease-in-out',
          selected === null && 'bg-secondary text-secondary-foreground',
        )}
      >
        {t("ageAll")}
      </button>

      {AGE_RANGES.map(({ value, labelKey }) => (
        <button
          key={value}
          onClick={() => setParam("ageRange", selected === value ? null : value)}
          className={cn(
            'bg-popover/40 py-1.5 px-4 rounded-4xl text-sm border hover:bg-secondary/90 hover:text-secondary-foreground cursor-pointer transition-colors duration-200 ease-in-out',
            selected === value && 'bg-secondary text-secondary-foreground',
          )}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  )
}

export default AgeFilter