import { z } from "zod"
import { stripHtml } from "@/lib/utils"

type Translate = (key: string) => string

const ageRangeSchema = z.enum(["0-3", "4-6", "7-10", "10-14", "parents", "all-ages"])

function createEventSchemas(t: Translate) {
  // Backend'deki ageRangesSchema ile aynı kurallar: en az bir grup, tekrar yok,
  // "all-ages" tek başına seçilmeli.
  const ageRangesSchema = z
    .array(ageRangeSchema)
    .min(1, t("validation.ageRangeRequired"))
    .refine((v) => new Set(v).size === v.length, t("validation.ageRangeDuplicate"))
    .refine(
      (v) => !v.includes("all-ages") || v.length === 1,
      t("validation.ageRangeAllAges")
    )

  const priceSchema = z.object({
    amount: z.number().min(0),
    currency: z.string().trim().min(1).default("EUR"),
  })

  const scheduleSchema = z
    .object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional().nullable(),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, t("validation.invalidTime")),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, t("validation.invalidTime")),
      isRecurring: z.boolean().optional().default(false),
      recurrenceRule: z.string().optional().nullable(),
    })
    .refine((data) => !data.endDate || data.startDate <= data.endDate, {
      message: t("validation.endBeforeStart"),
      path: ["endDate"],
    })

  // Nur beim Erstellen erzwungen — beim Bearbeiten muss ein bereits gestartetes/vergangenes,
  // aber weiterhin genehmigtes Event editierbar bleiben (z.B. Titel/Preis korrigieren), ohne
  // das Datum zwangsweise in die Zukunft verschieben zu müssen.
  const futureScheduleSchema = scheduleSchema.refine(
    (data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)),
    { message: t("validation.startInPast"), path: ["startDate"] }
  )

  // Not: coordinates'i burda GeoJSON'a transform ETMİYORUZ — backend {lat,lng} bekliyor
  // ve kendi transform'unu kendisi yapıyor. Burada transform edersek backend'in
  // beklediği şekil bozulur.
  const locationSchema = z.object({
    venueName: z.string().trim().optional().nullable(),
    addressLine: z.string().trim().min(1, t("validation.addressRequired")),
    city: z.string().trim().min(1, t("validation.cityRequired")),
    state: z.string().trim().optional().nullable(),
    zipCode: z
      .string()
      .regex(/^\d{5}$/, t("validation.zipInvalid"))
      .optional()
      .nullable(),
    country: z.string().trim().default("DE"),
    // Form state'inde null olabilir (adres henüz geocode edilmedi / bulunamadı), ama
    // submit'te null'a izin vermiyoruz. transform + z.NEVER output tipini de {lat,lng}'ye
    // daraltıyor — şekil aynı kalıyor, yani yukarıdaki "GeoJSON'a çevirmiyoruz" kuralı bozulmuyor.
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .nullable()
      .transform((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: t("validation.locationUnresolved"),
          })
          return z.NEVER
        }
        return value
      }),
  })

  const capacitySchema = z.object({
    max: z.number().int().min(1, t("validation.capacityMin")),
  })

  const baseEventSchema = z.object({
    title: z.string().trim().min(1, t("validation.titleRequired")).max(100),
    // Beschreibung kommt als HTML aus dem Rich-Text-Editor — Länge/Leer-Prüfung läuft auf
    // dem sichtbaren Text (stripHtml), nicht auf dem rohen Markup-String.
    description: z
      .string()
      .refine((html) => stripHtml(html).trim().length > 0, t("validation.descriptionRequired"))
      .refine((html) => stripHtml(html).length <= 2000, t("validation.descriptionMax")),
    coverImage: z.string().url().optional().nullable(),
    images: z.array(z.string().url()).optional().default([]),
    categoryId: z.string().min(1, t("validation.categoryRequired")),
    locationType: z.enum(["indoor", "outdoor", "online"]),
    ageRanges: ageRangesSchema,
    isFree: z.boolean(),
    price: priceSchema.optional().nullable(),
    schedule: scheduleSchema,
    location: locationSchema,
    capacity: capacitySchema,
  })

  const paidEvent = (data: { isFree: boolean; price?: { amount: number } | null }) =>
    data.isFree || !!data.price

  return {
    create: baseEventSchema
      .extend({ schedule: futureScheduleSchema })
      .strict()
      .refine(paidEvent, {
        message: t("validation.priceRequired"),
        path: ["price"],
      }),
    edit: baseEventSchema.strict().refine(paidEvent, {
      message: t("validation.priceRequired"),
      path: ["price"],
    }),
    update: baseEventSchema.partial().strict(),
  }
}

export const createEventSchema = (t: Translate) => createEventSchemas(t).create
export const editEventSchema = (t: Translate) => createEventSchemas(t).edit
export const updateEventSchema = (t: Translate) => createEventSchemas(t).update

export type CreateEventFormValues = z.infer<ReturnType<typeof createEventSchema>>
export type UpdateEventFormValues = z.infer<ReturnType<typeof updateEventSchema>>
