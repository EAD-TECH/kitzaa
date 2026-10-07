import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Kategoriename ist erforderlich.")
    .max(50, "Der Kategoriename darf höchstens 50 Zeichen lang sein."),

  description: z
    .string()
    .trim()
    .max(500, "Die Beschreibung darf höchstens 500 Zeichen lang sein.")
    .optional()
    .nullable(),

  icon: z.string().trim().optional(),

  isActive: z.boolean().default(true),
});
export const updateCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Kategoriename ist erforderlich.")
    .max(50, "Der Kategoriename darf höchstens 50 Zeichen lang sein.").optional(),

  description: z
    .string()
    .trim()
    .max(500, "Die Beschreibung darf höchstens 500 Zeichen lang sein.")
    .optional()
    .nullable(),

  icon: z.string().trim().optional(),

  isActive: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;