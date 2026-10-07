import * as z from "zod";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

/* onayda backendde karsılık yok  event ıcın de bunu alıcm*/
const approveSchema = z.object({
  status: z.literal("approved").optional(),
});

//* karar notu sorunlu rejectedte */
const rejectSchema = z.object({
  status: z.literal("rejected"),
  note: z.string().min(10, {
    message: "Bitte gib einen Ablehnungsgrund an (mindestens 10 Zeichen).",
  }),
});
//* eventın cancelı ıcın */
const cancelledSchema = z.object({
  status: z.literal("cancelled"),
  note: z.string().min(10, {
    message: "Bitte gib einen Absagegrund an (mindestens 10 Zeichen).",
  }),
});

export const reviewApplicationSchema = z.discriminatedUnion("status", [
  approveSchema,
  rejectSchema,
]);

export const eventActionSchema = z.discriminatedUnion("status", [
  approveSchema,
  rejectSchema,
  cancelledSchema,
]);

export type ReviewEventFormValues = z.infer<typeof eventActionSchema>;

export type ReviewApplicationFormValues = z.infer<
  typeof reviewApplicationSchema
>;

export const userFormSchema = z.object({
  email: z.string().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }),
  role: z.enum(["admin", "user", "organizer"], {
    message: "Bitte wähle eine Rolle aus.",
  }),
});

export const updateUserSchema = z.object({
  username: z.string().min(2, "Mindestens 2 Zeichen erforderlich").optional(),
  firstName: z.string().min(2, "Mindestens 2 Zeichen erforderlich").optional(),
  lastName: z.string().min(2, "Mindestens 2 Zeichen erforderlich").optional(),
  email: z
    .string()
    .email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." })
    .optional(),
  phone: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .trim()
      .min(7, "Die Telefonnummer ist zu kurz")
      .max(20, "Die Telefonnummer ist zu lang")
      .refine((value) => PHONE_REGEX.test(value), {
        message: "Bitte gib eine gültige Telefonnummer ein",
      })
      .optional(),
  ),

  role: z.enum(["user", "organizer", "admin"]).optional(),
  language: z.string().min(2, "Sprachauswahl ist erforderlich").optional(),
  isEmailVerified: z.boolean().optional(),
  location: z
    .object({
      state: z.string().min(2, "Bundesland ist erforderlich").optional(),
      city: z.string().min(2, "Stadt ist erforderlich").optional(),
      district: z.string().optional().nullable(),
      zipCode: z.string().min(3, "Ungültige Postleitzahl").optional(),
      country: z.string().min(2, "Land ist erforderlich").optional(),
    })
    .optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
