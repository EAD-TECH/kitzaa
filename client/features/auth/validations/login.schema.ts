import * as z from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z
    .object({
      login: z.string().trim().min(2, t("validation.loginRequired")),

      password: z.string().min(2, t("validation.passwordRequired")),
    })
    .strict(); // ekstra alan eklenemez. fazlaliklar atilir.

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
