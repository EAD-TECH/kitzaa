import type { FieldPath } from "react-hook-form"
import type { z } from "zod"
import type { createEventSchema } from "../validations/event.schema"

// Zod .default() alanları yüzünden input (form'a girilen ham veri) ve output (parse
// sonrası) tipleri farklı — react-hook-form'un state'i input tipini yansıtmalı,
// zodResolver'ın 3. generic'i (TTransformedValues) onSubmit'e output tipini verir.
export type CreateEventFormInput = z.input<typeof createEventSchema>

export type CreateEventFieldName = FieldPath<CreateEventFormInput>

export type CreateEventStepId = 1 | 2 | 3

export interface CreateEventStepMeta {
  id: CreateEventStepId
  label: string
  title: string
}
