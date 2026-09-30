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

export const updatePersonalInfoSchema = () =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(2, "Der Benutzername muss mindestens 2 Zeichen lang sein.")
        .max(50, "Der Benutzername darf höchstens 50 Zeichen lang sein."),

      firstName: z
        .string()
        .trim()
        .min(2, "Der Vorname muss mindestens 2 Zeichen lang sein.")
        .max(50, "Der Vorname darf höchstens 50 Zeichen lang sein."),

      lastName: z
        .string()
        .trim()
        .min(2, "Der Nachname muss mindestens 2 Zeichen lang sein.")
        .max(50, "Der Nachname darf höchstens 50 Zeichen lang sein."),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, "Bitte gib eine gültige E-Mail-Adresse ein."),

      language: z.enum(["de", "en"], {
        error: "Bitte wähle eine Sprache.",
      }),

      location: z.object({
        state: optionalLocationText(
          "Das Bundesland muss mindestens 2 Zeichen lang sein.",
          "Das Bundesland darf höchstens 50 Zeichen lang sein.",
        ),

        city: z
          .string()
          .trim()
          .min(2, "Die Stadt muss mindestens 2 Zeichen lang sein.")
          .max(50, "Die Stadt darf höchstens 50 Zeichen lang sein."),

        district: optionalLocationText(
          "Der Stadtteil muss mindestens 2 Zeichen lang sein.",
          "Der Stadtteil darf höchstens 50 Zeichen lang sein.",
        ),

        zipCode: z
          .string()
          .trim()
          .regex(ZIP_CODE_REGEX, "Bitte gib eine gültige deutsche Postleitzahl ein (5 Ziffern)."),

        country: z
          .string()
          .trim()
          .min(2, "Das Land muss mindestens 2 Zeichen lang sein.")
          .max(50, "Das Land darf höchstens 50 Zeichen lang sein."),
      }),
    })
    .strict();

export type UpdatePersonalInfoValues = z.infer<ReturnType<typeof updatePersonalInfoSchema>>;
