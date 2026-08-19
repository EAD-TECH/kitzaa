import * as z from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Das Passwort muss mindestens 8 Zeichen lang sein und Groß-, Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten"
      ),
    confirmPassword: z.string().min(1, "Bitte bestätige dein Passwort"),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
