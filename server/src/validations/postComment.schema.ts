import { z } from "zod";

export const createPostCommentSchema = z
  .object({
    postId: z.string().trim().min(1, "Post is required"),
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(1000, "Text cannot exceed 1000 characters"),
    // null/omit = top-level; set = reply to that comment (2-level thread)
    parentCommentId: z.string().trim().min(1).optional().nullable(),

    /* fe kısmı ıle yaptıgım api anlasması geregı mentionedUserId ekliyorum */

    mentionedUserIds: z.array(z.string().trim().min(1)).optional().default([]),
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
  .partial()
  .strict();

export type CreatePostCommentInput = z.infer<typeof createPostCommentSchema>;
export type UpdatePostCommentInput = z.infer<typeof updatePostCommentSchema>;
