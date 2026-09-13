import * as z from "zod";

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
