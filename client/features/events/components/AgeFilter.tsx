"use client"

import React from 'react'
import type { EventDTO } from '../types/event.types';
import { useQueryParams } from '../hooks/useQueryParams';
import { cn } from '@/lib/utils';


const AGE_RANGES: { value: EventDTO["ageRange"]; label: string }[] = [
  { value: "0-3", label: "0-3 Jahre" },
  { value: "4-6", label: "4-6 Jahre" },
  { value: "7-10", label: "7-10 Jahre" },
  { value: "10-14", label: "10-14 Jahre" },
  { value: "parents", label: "Für Eltern" },
]

const AgeFilter = () => {

  const { getParam, setParam } = useQueryParams()
  const selected = getParam("ageRange")

  return (
    <div className='flex flex-wrap gap-x-4 gap-y-2 mt-6'>
      <button
        onClick={() => setParam("ageRange", null)}
        className={cn(
          'bg-popover/40 py-1.5 px-4 rounded-4xl text-sm border hover:bg-primary/90 hover:text-primary-foreground cursor-pointer transition-colors duration-200 ease-in-out',
          selected === null && 'bg-primary text-primary-foreground',
        )}
      >
        Alle Alter
      </button>

      {AGE_RANGES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setParam("ageRange", selected === value ? null : value)}
          className={cn(
            'bg-popover/40 py-1.5 px-4 rounded-4xl text-sm border hover:bg-primary/90 hover:text-primary-foreground cursor-pointer transition-colors duration-200 ease-in-out',
            selected === value && 'bg-primary text-primary-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default AgeFilter