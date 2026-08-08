import type { Types } from "mongoose";
import type { CreatePostCommentInput } from "../validations/postComment.schema.js";
import type { IPost } from "../types/post.types.js";
import { createNotification } from "../helpers/createNotification.js";

interface CreateCommentPayload {
  validatedData: CreatePostCommentInput;
  user: {
    _id: Types.ObjectId;
    firstName?: string;
  };
  post: IPost;

  newCommentId: Types.ObjectId;
}

export const triggerCommentNotification = async (
  propData: CreateCommentPayload,
) => {
  const { validatedData, user, post, newCommentId } = propData;

  if (
    !validatedData.parentCommentId &&
    post.authorId.toString() !== user._id.toString()
  ) {
    createNotification(post.authorId, "post_comment", {
      title: "Yeni Yorum",
      message: `${user.firstName || "Birisi"} gönderine yeni bir yorum yaptı.`,
      senderId: user._id,  /* senderin bilgileri */

      /*   Frontend'e sunduğum 1. Seçenek: Sadece ID */
      relatedId: newCommentId,

      /*   Frontend'e sunduğum 2. Seçenek: Hazır Link
      Kullanıcı tıklayınca doğrudan postun içine ve yoruma gitsin diye */

      linkNotification: `/posts/${post._id}?comment=${newCommentId}`,

      relatedModel: "PostComment",
    });
  }
};
