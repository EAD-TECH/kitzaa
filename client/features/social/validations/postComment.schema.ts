import { z } from "zod";

export const createPostCommentSchema = z
  .object({
    postId: z.string().trim().min(1, "Post is required"),
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(1000, "Text cannot exceed 1000 characters"),
    parentCommentId: z.string().trim().min(1).optional().nullable(),
    mentionedUserIds: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

export const updatePostCommentSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(1000, "Text cannot exceed 1000 characters"),
  })
  .strict();

export type CreatePostCommentInput = z.infer<typeof createPostCommentSchema>;
export type UpdatePostCommentInput = z.infer<typeof updatePostCommentSchema>;
