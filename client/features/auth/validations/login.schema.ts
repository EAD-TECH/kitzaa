import * as z from "zod";

export const loginSchema = z
  .object({
    login: z.string().trim().min(2, "Username or email is required"),

    password: z.string().min(2, "Password is required"),
  })
  .strict(); // ekstra alan eklenemez. fazlaliklar atilir.

export type LoginFormValues = z.infer<typeof loginSchema>;
