import { z } from "zod";

type Translate = (key: string) => string;

export const institutionSchema = (t: Translate) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(120, t("validation.nameMax")),

    description: z.string().max(1000, t("validation.descriptionMax")).optional(),

    phone: z.string().optional(),

    website: z
      .string()
      .url(t("validation.urlInvalid"))
      .optional()
      .or(z.literal("")),

    address: z.string().max(200, t("validation.addressMax")).optional(),
  });

export type InstitutionFormValues = z.infer<ReturnType<typeof institutionSchema>>;
