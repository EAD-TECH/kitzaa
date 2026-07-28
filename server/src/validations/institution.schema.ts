import { z } from "zod";

const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

export const updateInstitutionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Institution name is required")
      .max(120, "Institution name cannot exceed 120 characters")
      .optional(),

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

    logoUrl: z.string().trim().url("Please enter a valid URL").nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
