import { z } from "zod";

type Translate = (key: string) => string;

const postLocationSchema = z
  .object({
    lat: z.number(),
    lng: z.number(),
  })
  .strict();

export const createPostSchema = (t: Translate) =>
  z
    .object({
      text: z.string().trim().min(1, t("validation.textRequired")).max(5000, t("validation.textMax")),
      imageUrl: z.string().trim().url(t("validation.invalidImageUrl")).optional().nullable(),
      eventId: z.string().trim().min(1).optional().nullable(),
      placeName: z.string().trim().min(1).optional().nullable(),
      city: z.string().trim().min(1).optional().nullable(),
      location: postLocationSchema.optional().nullable(),
    })
    .strict();

export const updatePostSchema = (t: Translate) => createPostSchema(t).partial().strict();

export type CreatePostInput = z.infer<ReturnType<typeof createPostSchema>>;
export type UpdatePostInput = z.infer<ReturnType<typeof updatePostSchema>>;
