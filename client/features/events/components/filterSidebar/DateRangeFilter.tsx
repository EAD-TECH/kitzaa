"use client"

import * as React from "react"
import { CalendarIcon, CalendarRange } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}




function DatePickerField({
  id,
  label,
}: {
  id: string
  label: string
}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <Field className="min-w-0 flex-1">
      <FieldLabel htmlFor={id} className="text-sm font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={value}
          placeholder="TT.MM.JJJJ"
          onChange={(e) => {
            const nextDate = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(nextDate)) {
              setDate(nextDate)
              setMonth(nextDate)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Datum auswählen"
                >
                  <CalendarIcon />
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                // className="[--cell-size:--spacing(7)]"
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(nextDate) => {
                  setDate(nextDate)
                  setValue(formatDate(nextDate))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}





export function DateRangeFilter() {
  return (
    <FieldSet>
      <FieldLegend
        variant="label"
        className="flex items-center gap-1.5 font-heading text-xs font-medium tracking-wide text-foreground uppercase"
      >
        <CalendarRange className="size-3.5" />
        ZEITRAUM
      </FieldLegend>
      <div className="flex gap-3">
        <DatePickerField id="date-from" label="Von" />
        <DatePickerField id="date-to" label="Bis" />
      </div>
    </FieldSet>
  )
}
