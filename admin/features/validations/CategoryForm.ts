import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Kategori adı zorunludur.")
    .max(50, "Kategori adı en fazla 50 karakter olabilir."),

  description: z
    .string()
    .trim()
    .max(500, "Açıklama en fazla 500 karakter olabilir.")
    .optional()
    .nullable(),

  icon: z.string().trim().optional(),

  isActive: z.boolean().default(true),
});
export const updateCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Kategori adı zorunludur.")
    .max(50, "Kategori adı en fazla 50 karakter olabilir.").optional(),

  description: z
    .string()
    .trim()
    .max(500, "Açıklama en fazla 500 karakter olabilir.")
    .optional()
    .nullable(),

  icon: z.string().trim().optional(),

  isActive: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;