"use client"

import { useState } from "react"
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import type { CreateEventFormInput } from "../../types/createEvent.types"

interface EventPricingStepProps {
  form: UseFormReturn<CreateEventFormInput>
}

const isEmptyNumber = (value: number | undefined) => value === undefined || Number.isNaN(value)

// type="number" input'larda .value'yu React her render'da programatik olarak yeniden
// yazınca tarayıcı imleci otomatik sona atlıyor — "0"ın önüne geçip yazmak/silmek
// imkansız hale geliyor. Bunun yerine type="text" kullanıp kendi metin state'imizi
// tutuyoruz; sadece dışarıdan (örn. isFree toggle'ı) gelen değişikliklerde form
// değeriyle senkronize ediyoruz, kullanıcı yazarken metne dokunmuyoruz. Senkronizasyon
// render sırasında (React'in "adjusting state when a prop changes" deseniyle) yapılıyor,
// bir useEffect içinde değil.
function useNumericText(value: number | undefined, onChange: (value: number) => void, allowDecimal: boolean) {
  const [text, setText] = useState(() => (isEmptyNumber(value) ? "" : String(value)))
  const [syncedValue, setSyncedValue] = useState(value)

  if (!Object.is(syncedValue, value)) {
    setSyncedValue(value)
    const numericText = text === "" ? undefined : Number(text)
    if (!Object.is(numericText, value)) {
      setText(isEmptyNumber(value) ? "" : String(value))
    }
  }

  const pattern = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (!pattern.test(raw)) return
    setText(raw)
    onChange(raw === "" ? NaN : Number(raw))
  }

  return { text, handleChange }
}

function PriceAmountInput({
  field,
  disabled,
}: {
  field: ControllerRenderProps<CreateEventFormInput, "price.amount">
  disabled: boolean
}) {
  const { text, handleChange } = useNumericText(field.value, field.onChange, true)

  return (
    <InputGroupInput
      {...field}
      type="text"
      inputMode="decimal"
      placeholder="0.00"
      disabled={disabled}
      value={text}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
    />
  )
}

function CapacityInput({
  field,
}: {
  field: ControllerRenderProps<CreateEventFormInput, "capacity.max">
}) {
  const { text, handleChange } = useNumericText(field.value, field.onChange, false)

  return (
    <Input
      {...field}
      type="text"
      inputMode="numeric"
      className="bg-background"
      placeholder="z.B. 20"
      value={text}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
    />
  )
}

export function EventPricingStep({ form }: EventPricingStepProps) {
  const isFree = form.watch("isFree")

  return (
    <div className="flex flex-col gap-5">
      <FormField
        control={form.control}
        name="isFree"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent/50 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <FormLabel className="text-sm font-medium">Kostenloses Event</FormLabel>
                <p className="text-xs text-muted-foreground">Familien können an dieser Aktivität kostenlos teilnehmen.</p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    if (checked) {
                      form.setValue("price", null)
                    } else if (!form.getValues("price")) {
                      form.setValue("price", { amount: NaN, currency: "EUR" })
                    }
                  }}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price.amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preis</FormLabel>
            <FormControl>
              <InputGroup className="bg-background">
                <InputGroupAddon>€</InputGroupAddon>
                <PriceAmountInput field={field} disabled={isFree} />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity.max"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximale Kapazität *</FormLabel>
            <p className="text-xs text-muted-foreground">Gesamtzahl der erlaubten Teilnehmer.</p>
            <FormControl>
              <CapacityInput field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
