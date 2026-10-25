import { z } from "zod";

export const createCompleteProfileSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(2, t("validation.usernameRequired"))
      .max(50, t("validation.usernameMax")),
    postalCode: z.string().regex(/^\d{5}$/, t("validation.zipInvalid")),
    city: z.string().trim().min(2, t("validation.cityRequired")).max(80),
    state: z.string().trim().min(2, t("validation.stateRequired")).max(80),
  });

export type CompleteProfileValues = z.infer<ReturnType<typeof createCompleteProfileSchema>>;
