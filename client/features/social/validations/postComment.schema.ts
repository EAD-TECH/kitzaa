import { z } from "zod";

export const createPostCommentSchema = z
  .object({
    postId: z.string().trim().min(1, "Beitrag ist erforderlich"),
    text: z
      .string()
      .trim()
      .min(1, "Text ist erforderlich")
      .max(1000, "Der Text darf höchstens 1000 Zeichen lang sein"),
    parentCommentId: z.string().trim().min(1).optional().nullable(),
    mentionedUserIds: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

export const updatePostCommentSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, "Text ist erforderlich")
      .max(1000, "Der Text darf höchstens 1000 Zeichen lang sein"),
  })
  .strict();

export type CreatePostCommentInput = z.infer<typeof createPostCommentSchema>;
export type UpdatePostCommentInput = z.infer<typeof updatePostCommentSchema>;
