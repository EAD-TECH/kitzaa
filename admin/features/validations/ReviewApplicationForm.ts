import * as z from "zod";

/* onayda backendde karsılık yok */
const approveSchema = z.object({
  status: z.literal("approved"),
});

//* karar notu sorunlu rejectedte */
const rejectSchema = z.object({
  status: z.literal("rejected"),
  note: z.string().min(10, {
    message: "Lütfen reddetme sebebini (en az 10 karakter) açıklayın.",
  }),
});

export const reviewApplicationSchema = z.discriminatedUnion("status", [
  approveSchema,
  rejectSchema,
]);

export type ReviewApplicationFormValues = z.infer<
  typeof reviewApplicationSchema
>;
