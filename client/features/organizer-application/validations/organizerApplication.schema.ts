import { z } from "zod";

const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

const institutionDataSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name der Einrichtung ist erforderlich")
      .max(120, "Der Name der Einrichtung darf höchstens 120 Zeichen lang sein"),

    description: z.string().trim().max(1000, "Die Beschreibung ist zu lang").nullable().optional(),

    address: z.string().trim().max(200, "Die Adresse ist zu lang").nullable().optional(),

    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Bitte gib eine gültige Telefonnummer ein")
      .nullable()
      .optional(),

    website: z.string().trim().url("Bitte gib eine gültige URL ein").nullable().optional(),

    category: z.string().trim().max(60, "Die Kategorie ist zu lang").nullable().optional(),
  })
  .strict();

export const applyOrganizerSchema = z
  .object({
    institutionData: institutionDataSchema,
    message: z.string().trim().max(500, "Die Nachricht ist zu lang").nullable().optional(),
  })
  .strict();

export type ApplyOrganizerInput = z.infer<typeof applyOrganizerSchema>;

