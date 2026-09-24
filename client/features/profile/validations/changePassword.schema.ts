import * as z from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export const createChangePasswordSchema = () =>
  z
    .object({
      currentPassword: z.string().min(6, "Aktuelles Passwort ist erforderlich"),
      newPassword: z.string().regex(
        PASSWORD_REGEX,
        "Mindestens 8 Zeichen, mit Großbuchstaben, Kleinbuchstaben, einer Zahl und einem Sonderzeichen",
      ),
      confirmPassword: z.string().min(1, "Bitte bestätige das neue Passwort"),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Die Passwörter stimmen nicht überein",
      path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
