"use client"

import * as React from "react"
import { de, enUS } from "date-fns/locale"
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
import { useLocale, useTranslations } from "next-intl"
import { useQueryParams } from "../../hooks/useQueryParams"

function formatDate(date: Date | undefined, locale: string) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString(locale, {
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
  const t = useTranslations("Events")
  const locale = useLocale()
  const calendarLocale = locale === "en" ? enUS : de
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
          value={formatDate(date, locale)}
          placeholder={t("datePlaceholder")}
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
              aria-label={t("clearDate")}
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
                    aria-label={t("pickDate")}
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
                  locale={calendarLocale}
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
  const t = useTranslations("Events")
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
        {t("dateRange")}
      </FieldLegend>
      <div className="flex gap-3">
        <DatePickerField
          id="date-from"
          label={t("from")}
          date={dateFrom}
          onSelect={(date) => setParams({ dateFrom: date ? toISODateString(date) : null })}
        />
        <DatePickerField
          id="date-to"
          label={t("to")}
          date={dateTo}
          onSelect={(date) => setParams({ dateTo: date ? toISODateString(date) : null })}
        />
      </div>
    </FieldSet>
  )
}
