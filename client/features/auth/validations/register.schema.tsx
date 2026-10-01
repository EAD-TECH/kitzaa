import { z } from "zod"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/
const ZIP_CODE_REGEX = /^\d{5}$/

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(2, t("validation.firstNameRequired"))
        .max(50, t("validation.firstNameMax")),

      lastName: z
        .string()
        .trim()
        .min(2, t("validation.lastNameRequired"))
        .max(50, t("validation.lastNameMax")),

      username: z
        .string()
        .trim()
        .min(2, t("validation.usernameRequired"))
        .max(50, t("validation.usernameMax")),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, t("validation.emailInvalid")),

      password: z
        .string()
        .regex(PASSWORD_REGEX, t("validation.passwordRules")),

      confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),

      countryCode: z.string(),

      phone: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || PHONE_REGEX.test(value), {
          message: t("validation.phoneInvalid"),
        }),

      language: z.enum(["de", "en"]),

      location: z.object({
        state: z
          .string()
          .trim()
          .min(2, t("validation.stateRequired")),

        city: z
          .string()
          .trim()
          .min(2, t("validation.cityRequired")),

        district: z.string().trim().optional(),

        zipCode: z
          .string()
          .regex(ZIP_CODE_REGEX, t("validation.zipInvalid")),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    })

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>

export function toRegisterPayload(data: RegisterFormValues) {
  const { confirmPassword, countryCode, phone, ...rest } = data
  return {
    ...rest,
    phone: phone ? `${countryCode}${phone}` : undefined,
  }
}

export type RegisterPayload = ReturnType<typeof toRegisterPayload>
