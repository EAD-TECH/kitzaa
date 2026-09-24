import { z } from "zod";

export const institutionSchema = z.object({
  name: z
    .string()
    .min(2, "Der Name muss mindestens 2 Zeichen lang sein.")
    .max(120, "Der Name darf höchstens 120 Zeichen lang sein."),

  description: z
    .string()
    .max(1000, "Die Beschreibung darf höchstens 1000 Zeichen lang sein.")
    .optional(),

  phone: z.string().optional(),

  website: z
    .string()
    .url("Bitte gib eine gültige URL ein.")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "Die Adresse darf höchstens 200 Zeichen lang sein.")
    .optional(),
});

export type InstitutionFormValues = z.infer<typeof institutionSchema>;