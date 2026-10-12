"use client"

import type { UseFormReturn } from "react-hook-form"
import { de, enUS } from "date-fns/locale"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, Loader2, MapPin } from "lucide-react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { CreateEventFormInput } from "../../types/createEvent.types"
import { RECURRENCE_VALUES } from "../../constants/eventFormOptions"
import { useAddressCoordinates, type GeocodeStatus } from "../../hooks/useAddressCoordinates"

interface EventScheduleStepProps {
  form: UseFormReturn<CreateEventFormInput>
}

// z.coerce.date() input tipini "unknown" olarak tanımlıyor — RHF field.value burada
// Date/string/undefined olabilir, bu yardımcı güvenli bir şekilde Date'e çeviriyor.
function toDateOrUndefined(value: unknown): Date | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value as string | number)
  return Number.isNaN(date.getTime()) ? undefined : date
}

// location.coordinates için ayrı bir input yok, bu yüzden <FormMessage /> hatayı kendiliğinden
// göstermiyor — geocoding durumu ve submit hatası burada gösteriliyor.
function GeocodeHint({ status, error }: { status: GeocodeStatus; error?: string }) {
  const t = useTranslations("Events")
  if (status === "loading") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        {t("locating")}
      </p>
    )
  }

  if (status === "found") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5" />
        {t("locationFound")}
      </p>
    )
  }

  const message =
    status === "not-found"
      ? t("cityNotFound")
      : status === "failed"
        ? t("locationLookupFailed")
        : error

  if (!message) return null

  return (
    <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3.5 shrink-0" />
      {message}
    </p>
  )
}

export function EventScheduleStep({ form }: EventScheduleStepProps) {
  const t = useTranslations("Events")
  const locale = useLocale()
  const calendarLocale = locale === "en" ? enUS : de
  const recurrenceOptions = RECURRENCE_VALUES.map((value) => ({
    value,
    label: t(value),
  }))
  const isRecurring = form.watch("schedule.isRecurring")
  const geocodeStatus = useAddressCoordinates(form)
  const coordinatesError = form.formState.errors.location?.coordinates?.message

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("when")}</h3>

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField
            control={form.control}
            name="schedule.startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("startDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <FormControl>
                        <button
                          type="button"
                          className={cn(
                            "flex h-9 w-full items-center gap-2 rounded-xl border border-input bg-background px-3 text-sm outline-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="size-4 shrink-0" />
                          {toDateOrUndefined(field.value)
                            ? format(toDateOrUndefined(field.value)!, "dd.MM.yyyy")
                            : t("datePlaceholder")}
                        </button>
                      </FormControl>
                    }
                  />
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={calendarLocale}
                      selected={toDateOrUndefined(field.value)}
                      onSelect={(date) => date && field.onChange(date)}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule.endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("endDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <FormControl>
                        <button
                          type="button"
                          className={cn(
                            "flex h-9 w-full items-center gap-2 rounded-xl border border-input bg-background px-3 text-sm outline-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="size-4 shrink-0" />
                          {toDateOrUndefined(field.value)
                            ? format(toDateOrUndefined(field.value)!, "dd.MM.yyyy")
                            : t("datePlaceholder")}
                        </button>
                      </FormControl>
                    }
                  />
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={calendarLocale}
                      selected={toDateOrUndefined(field.value)}
                      onSelect={(date) => field.onChange(date ?? null)}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField
            control={form.control}
            name="schedule.startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startTime")}</FormLabel>
                <FormControl>
                  <Input type="time" className="bg-background" {...field} />
                </FormControl>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule.endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("endTime")}</FormLabel>
                <FormControl>
                  <Input type="time" className="bg-background" {...field} />
                </FormControl>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="schedule.isRecurring"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent/50 px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <FormLabel className="text-sm font-medium">{t("recurring")}</FormLabel>
                  <p className="text-xs text-muted-foreground">{t("recurringHint")}</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {isRecurring && (
          <FormField
            control={form.control}
            name="schedule.recurrenceRule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recurrence")}</FormLabel>
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-background focus-visible:ring-[0.5px] focus-visible:ring-ring/20">
                      <SelectValue placeholder={t("selectRecurrence")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recurrenceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("where")}</h3>

        <FormField
          control={form.control}
          name="location.venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("venueName")}</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
                  placeholder={t("venuePlaceholder")}
                  spellCheck={false}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.addressLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
                  placeholder={t("addressPlaceholder")}
                  spellCheck={false}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <FormField
            control={form.control}
            name="location.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder={t("cityPlaceholder")}
                    spellCheck={false}
                    {...field}
                  />
                </FormControl>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("zip")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder={t("zipPlaceholder")}
                    spellCheck={false}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <div className="min-h-4">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <GeocodeHint status={geocodeStatus} error={coordinatesError} />

        <FormField
          control={form.control}
          name="location.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("state")}</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
                  placeholder={t("statePlaceholder")}
                  spellCheck={false}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
