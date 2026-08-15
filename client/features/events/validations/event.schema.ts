import { z } from "zod"

const ageRangeSchema = z
  .object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  })
  .refine((data) => data.min <= data.max, {
    message: "Mindestalter darf nicht größer als Höchstalter sein",
    path: ["max"],
  })

const priceSchema = z.object({
  amount: z.number().min(0),
  currency: z.string().trim().min(1).default("EUR"),
})

const scheduleSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional().nullable(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Ungültiges Zeitformat (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Ungültiges Zeitformat (HH:mm)"),
    isRecurring: z.boolean().optional().default(false),
    recurrenceRule: z.string().optional().nullable(),
  })
  .refine((data) => !data.endDate || data.startDate <= data.endDate, {
    message: "Startdatum darf nicht nach dem Enddatum liegen",
    path: ["endDate"],
  })
  .refine((data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Startdatum darf nicht in der Vergangenheit liegen",
    path: ["startDate"],
  })

// Not: coordinates'i burda GeoJSON'a transform ETMİYORUZ — backend {lat,lng} bekliyor
// ve kendi transform'unu kendisi yapıyor. Burada transform edersek backend'in
// beklediği şekil bozulur.
const locationSchema = z.object({
  venueName: z.string().trim().optional().nullable(),
  addressLine: z.string().trim().min(1, "Adresse ist erforderlich"),
  city: z.string().trim().min(1, "Stadt ist erforderlich"),
  state: z.string().trim().optional().nullable(),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, "Bitte gib eine gültige Postleitzahl ein (5 Ziffern)")
    .optional()
    .nullable(),
  country: z.string().trim().default("DE"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
})

const capacitySchema = z.object({
  max: z.number().int().min(1, "Kapazität muss mindestens 1 sein"),
})

const baseEventSchema = z.object({
  title: z.string().trim().min(1, "Titel ist erforderlich").max(100),
  description: z.string().trim().min(1, "Beschreibung ist erforderlich").max(2000),
  coverImage: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  categoryId: z.string().min(1, "Kategorie ist erforderlich"),
  ageRange: ageRangeSchema,
  isFree: z.boolean(),
  price: priceSchema.optional().nullable(),
  schedule: scheduleSchema,
  location: locationSchema,
  capacity: capacitySchema,
})

// CREATE SCHEMA

export const createEventSchema = baseEventSchema
  .strict()
  .refine((data) => data.isFree || !!data.price, {
    message: "Für kostenpflichtige Events ist ein Preis erforderlich",
    path: ["price"],
  })

// UPDATE SCHEMA

export const updateEventSchema = baseEventSchema.partial().strict()

export type CreateEventFormValues = z.infer<typeof createEventSchema>
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>
