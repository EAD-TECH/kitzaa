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
    message: "Lütfen reddetme sebebini (en az 10 karakter) açıklayın.",
  }),
});
//* eventın cancelı ıcın */
const cancelledSchema = z.object({
  status: z.literal("cancelled"),
  note: z.string().min(10, {
    message: "Lütfen iptal sebebini (en az 10 karakter) açıklayın.",
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
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  role: z.enum(["admin", "user", "organizer"], {
    message: "Lütfen bir rol seçin.",
  }),
});

export const updateUserSchema = z.object({
  username: z.string().min(2, "En az 2 karakter olmalı").optional(),
  firstName: z.string().min(2, "En az 2 karakter olmalı").optional(),
  lastName: z.string().min(2, "En az 2 karakter olmalı").optional(),
  email: z
    .string()
    .email({ message: "Geçerli bir e-posta adresi giriniz." })
    .optional(),
  phone: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .trim()
      .min(7, "Phone number is too short")
      .max(20, "Phone number is too long")
      .refine((value) => PHONE_REGEX.test(value), {
        message: "Please enter a valid phone number",
      })
      .optional(),
  ),

  role: z.enum(["user", "organizer", "admin"]).optional(),
  language: z.string().min(2, "Dil seçimi zorunlu").optional(),
  isEmailVerified: z.boolean().optional(),
  location: z
    .object({
      state: z.string().min(2, "Eyalet/Bölge zorunlu").optional(),
      city: z.string().min(2, "Şehir zorunlu").optional(),
      district: z.string().optional().nullable(),
      zipCode: z.string().min(3, "Posta kodu geçersiz").optional(),
      country: z.string().min(2, "Ülke zorunlu").optional(),
    })
    .optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
