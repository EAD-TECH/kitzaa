import { z } from "zod";

type Translate = (key: string) => string;

const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

export const applyOrganizerSchema = (t: Translate) => {
  const institutionDataSchema = z
    .object({
      name: z
        .string()
        .trim()
        .min(2, t("validation.nameRequired"))
        .max(120, t("validation.nameMax")),

      description: z.string().trim().max(1000, t("validation.descriptionMax")).nullable().optional(),

      address: z.string().trim().max(200, t("validation.addressMax")).nullable().optional(),

      phone: z
        .string()
        .trim()
        .regex(PHONE_REGEX, t("validation.phoneInvalid"))
        .nullable()
        .optional(),

      website: z.string().trim().url(t("validation.urlInvalid")).nullable().optional(),

      category: z.string().trim().max(60, t("validation.categoryMax")).nullable().optional(),
    })
    .strict();

  return z
    .object({
      institutionData: institutionDataSchema,
      message: z.string().trim().max(500, t("validation.messageMax")).nullable().optional(),
    })
    .strict();
};

export type ApplyOrganizerInput = z.infer<ReturnType<typeof applyOrganizerSchema>>;
