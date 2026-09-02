"use client"

import * as React from "react"
import { CalendarIcon, CalendarRange, X } from "lucide-react"

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
import { useQueryParams } from "../../hooks/useQueryParams"

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

// URL'deki "YYYY-MM-DD" formatını Date'e çevirir.
function parseISODate(value: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  const date = new Date(year, month - 1, day)
  return isValidDate(date) ? date : undefined
}

// Date'i "YYYY-MM-DD"ye çevirir — toISOString() kullanmıyoruz çünkü UTC'ye çevirirken
// yerel saat dilimine göre günü bir öncekine/sonrakine kaydırabilir.
function toISODateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function DatePickerField({
  id,
  label,
  date,
  onSelect,
}: {
  id: string
  label: string
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date)

  // URL parametresi dışarıdan değişirse (örn. geri/ileri gitme) takvimin ayını senkronize et
  React.useEffect(() => {
    setMonth(date)
  }, [date])

  return (
    <Field className="min-w-0 flex-1">
      <FieldLabel htmlFor={id} className="text-sm font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={formatDate(date)}
          placeholder="TT.MM.JJJJ"
          readOnly
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          {date ? (
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Datum entfernen"
              onClick={() => onSelect(undefined)}
            >
              <X />
            </InputGroupButton>
          ) : (
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
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(nextDate) => {
                    onSelect(nextDate)
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export function DateRangeFilter() {
  const { getParam, setParams } = useQueryParams()

  const dateFrom = parseISODate(getParam("dateFrom"))
  const dateTo = parseISODate(getParam("dateTo"))

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
        <DatePickerField
          id="date-from"
          label="Von"
          date={dateFrom}
          onSelect={(date) => setParams({ dateFrom: date ? toISODateString(date) : null })}
        />
        <DatePickerField
          id="date-to"
          label="Bis"
          date={dateTo}
          onSelect={(date) => setParams({ dateTo: date ? toISODateString(date) : null })}
        />
      </div>
    </FieldSet>
  )
}
