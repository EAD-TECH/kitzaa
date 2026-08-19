import * as z from "zod";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(EMAIL_REGEX, 'Bitte gib eine gültige E-Mail-Adresse ein'),
}).strict();

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
