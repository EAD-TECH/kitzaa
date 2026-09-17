import { z } from "zod"

/* email yok */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/
const ZIP_CODE_REGEX = /^\d{5}$/

export const createSetupAccountSchema = (t: (key: string) => string) =>
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

     /* newPassword olarak beklıyorm backendde */
      newPassword: z
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
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    })


export type SetupAccountFormValues = z.infer<ReturnType<typeof createSetupAccountSchema>>


export function toSetupAccountPayload(data: SetupAccountFormValues) {
  const {  countryCode, phone, ...rest } = data
  return {
    ...rest,
    phone: phone ? `${countryCode}${phone}` : undefined,
  }
}

export type SetupAccountPayload = ReturnType<typeof toSetupAccountPayload>