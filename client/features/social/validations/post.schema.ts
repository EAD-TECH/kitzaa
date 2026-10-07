import { z } from 'zod';

const postLocationSchema = z
  .object({
    lat: z.number(),
    lng: z.number(),
  })
  .strict();

const basePostSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Text ist erforderlich')
    .max(5000, 'Der Text darf höchstens 5000 Zeichen lang sein'),
  imageUrl: z.string().trim().url('Ungültige Bild-URL').optional().nullable(),
  eventId: z.string().trim().min(1).optional().nullable(),
  placeName: z.string().trim().min(1).optional().nullable(),
  city: z.string().trim().min(1).optional().nullable(),
  location: postLocationSchema.optional().nullable(),
});

export const createPostSchema = basePostSchema.strict();

export const updatePostSchema = basePostSchema.partial().strict();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
