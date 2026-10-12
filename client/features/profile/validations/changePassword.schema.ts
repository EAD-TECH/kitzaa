import * as z from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

type Translate = (key: string) => string

export const createChangePasswordSchema = (t: Translate) =>
  z
    .object({
      currentPassword: z.string().min(6, t("validation.currentRequired")),
      newPassword: z.string().regex(PASSWORD_REGEX, t("validation.passwordRules")),
      confirmPassword: z.string().min(1, t("validation.confirmRequired")),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
