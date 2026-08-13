import { z } from "zod"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/
const ZIP_CODE_REGEX = /^\d{5}$/

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Vorname ist erforderlich")
      .max(50, "Vorname darf höchstens 50 Zeichen lang sein"),

    lastName: z
      .string()
      .trim()
      .min(2, "Nachname ist erforderlich")
      .max(50, "Nachname darf höchstens 50 Zeichen lang sein"),

    username: z
      .string()
      .trim()
      .min(2, "Nutzername ist erforderlich")
      .max(50, "Nutzername darf höchstens 50 Zeichen lang sein"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .regex(EMAIL_REGEX, "Bitte gib eine gültige E-Mail-Adresse ein"),

    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Das Passwort muss mindestens 8 Zeichen lang sein und Groß-, Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten"
      ),

    confirmPassword: z.string().min(1, "Bitte bestätige dein Passwort"),

    countryCode: z.string(),

    phone: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || PHONE_REGEX.test(value), {
        message: "Bitte gib eine gültige Telefonnummer ein",
      }),

    state: z
      .string()
      .trim()
      .min(2, "Bundesland ist erforderlich"),

    city: z
      .string()
      .trim()
      .min(2, "Stadt ist erforderlich"),

    district: z.string().trim().optional(),

    zipCode: z
      .string()
      .regex(ZIP_CODE_REGEX, "Bitte gib eine gültige Postleitzahl ein"),

    language: z.enum(["de", "en"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
