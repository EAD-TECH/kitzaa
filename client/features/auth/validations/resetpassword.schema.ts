import * as z from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      newPassword: z.string().regex(PASSWORD_REGEX, t("validation.passwordRules")),
      confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type ResetPasswordValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
