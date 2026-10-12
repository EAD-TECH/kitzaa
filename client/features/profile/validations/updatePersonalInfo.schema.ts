import * as z from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_CODE_REGEX = /^\d{5}$/;

// Boş input undefined değil "" gelir. Opsiyonel adreste "" geçer, 1 karakter kalırsa hata verir.
const optionalLocationText = (tooShort: string, tooLong: string) =>
  z
    .string()
    .trim()
    .max(50, tooLong)
    .refine((value) => value.length === 0 || value.length >= 2, {
      message: tooShort,
    })
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional();

type Translate = (key: string) => string

export const updatePersonalInfoSchema = (t: Translate) =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(2, t("validation.usernameMin"))
        .max(50, t("validation.usernameMax")),

      firstName: z
        .string()
        .trim()
        .min(2, t("validation.firstNameMin"))
        .max(50, t("validation.firstNameMax")),

      lastName: z
        .string()
        .trim()
        .min(2, t("validation.lastNameMin"))
        .max(50, t("validation.lastNameMax")),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, t("validation.emailInvalid")),

      language: z.enum(["de", "en"], {
        error: t("validation.languageRequired"),
      }),

      location: z.object({
        state: optionalLocationText(t("validation.stateMin"), t("validation.stateMax")),

        city: z
          .string()
          .trim()
          .min(2, t("validation.cityMin"))
          .max(50, t("validation.cityMax")),

        district: optionalLocationText(t("validation.districtMin"), t("validation.districtMax")),

        zipCode: z.string().trim().regex(ZIP_CODE_REGEX, t("validation.zipInvalid")),

        country: z
          .string()
          .trim()
          .min(2, t("validation.countryMin"))
          .max(50, t("validation.countryMax")),
      }),
    })
    .strict();

export type UpdatePersonalInfoValues = z.infer<ReturnType<typeof updatePersonalInfoSchema>>;
