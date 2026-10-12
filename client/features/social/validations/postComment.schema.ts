import { z } from "zod";

type Translate = (key: string) => string;

export const createPostCommentSchema = (t: Translate) =>
  z
    .object({
      postId: z.string().trim().min(1, t("validation.postRequired")),
      text: z
        .string()
        .trim()
        .min(1, t("validation.commentTextRequired"))
        .max(1000, t("validation.commentTextMax")),
      parentCommentId: z.string().trim().min(1).optional().nullable(),
      mentionedUserIds: z.array(z.string().trim().min(1)).optional(),
    })
    .strict();

export const updatePostCommentSchema = (t: Translate) =>
  z
    .object({
      text: z
        .string()
        .trim()
        .min(1, t("validation.commentTextRequired"))
        .max(1000, t("validation.commentTextMax")),
    })
    .strict();

export type CreatePostCommentInput = z.infer<ReturnType<typeof createPostCommentSchema>>;
export type UpdatePostCommentInput = z.infer<ReturnType<typeof updatePostCommentSchema>>;
