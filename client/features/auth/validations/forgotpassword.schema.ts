import * as z from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, t("validation.emailInvalid")),
    })
    .strict();

export type ForgotPasswordValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
