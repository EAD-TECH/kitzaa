import { z } from "zod";

const specificDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "specificDate must use YYYY-MM-DD")
  .refine((value) => {
    const [yearText, monthText, dayText] = value.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    if (!year || !month || !day) {
      return false;
    }

    const utcDate = new Date(Date.UTC(year, month - 1, day));

    return (
      utcDate.getUTCFullYear() === year &&
      utcDate.getUTCMonth() === month - 1 &&
      utcDate.getUTCDate() === day
    );
  }, "specificDate must be a real calendar date");

export const aiEventSearchOutputSchema = z.object({
  childAges: z
    .array(z.number().int().min(0).max(17))
    .min(1)
    .max(10)
    .nullable(),

  datePreference: z
    .enum(["today", "tomorrow", "weekend", "thisMonth", "specific", "any"])
    .nullable(),

  specificDate: specificDateSchema.nullable(),

  environment: z
    .enum(["indoor", "outdoor", "online", "any"])
    .nullable(),

  timePreference: z
    .enum(["morning", "afternoon", "evening", "any"])
    .nullable(),

  cities: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(5)
    .nullable(),

  maxPrice: z.number().finite().min(0).max(10_000).nullable(),
});

export type AiEventSearchOutput = z.infer<
  typeof aiEventSearchOutputSchema
>;