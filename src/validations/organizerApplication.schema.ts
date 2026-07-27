import { z } from "zod";

// Telefon formati (user.schema.ts'teki ile ayni mantik; orada export edilmedigi icin burada tekrar tanimliyoruz)
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

// Basvuru aninda doldurulan kurum bilgisi (IInstitutionData ile eslesir)
const institutionDataSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Institution name is required")
      .max(120, "Institution name cannot exceed 120 characters"),

    description: z.string().trim().max(1000, "Description is too long").nullable().optional(),

    address: z.string().trim().max(200, "Address is too long").nullable().optional(),

    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Please enter a valid phone number")
      .nullable()
      .optional(),

    website: z.string().trim().url("Please enter a valid URL").nullable().optional(),

    category: z.string().trim().max(60, "Category is too long").nullable().optional(),
  })
  .strict();

// 1) Kullanici basvurusu: POST /organizer-applications
export const applyOrganizerSchema = z
  .object({
    institutionData: institutionDataSchema,
    message: z.string().trim().max(500, "Message is too long").nullable().optional(),
  })
  .strict();

// 2) Admin reddi: sebep zorunlu
export const rejectApplicationSchema = z
  .object({
    rejectedReason: z
      .string()
      .trim()
      .min(3, "Rejection reason is required")
      .max(500, "Reason cannot exceed 500 characters"),
  })
  .strict();

// Controller'da kullanmak icin cikarilmis TypeScript tipleri
export type ApplyOrganizerInput = z.infer<typeof applyOrganizerSchema>;
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;

