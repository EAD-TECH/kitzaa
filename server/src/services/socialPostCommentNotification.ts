import type { Types } from "mongoose";
import type { CreatePostCommentInput } from "../validations/postComment.schema.js";
import type { IPost } from "../types/post.types.js";
import { createNotification } from "../helpers/createNotification.js";
import postCommentModel from "../models/postCommentModel.js";

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
  /* gelen propu destruct ettım */
  const { validatedData, user, post, newCommentId } = propData;

  /*   Frontend'e sunduğum 2. Seçenek: Hazır Link
      Kullanıcı tıklayınca doğrudan postun içine ve yoruma gitsin diye */
  const linkNotification = `/posts/${post._id}?comment=${newCommentId}`;

  /* işlemı yapan db ye kaydedılen bıldırm yapan kısı */
  const senderId = user._id;

  /* REPLY */
  if (validatedData.parentCommentId) {
    const parentComment = await postCommentModel.findOne({
      _id: validatedData.parentCommentId,
      isDeleted: false,
    });

    if (!parentComment) return null;

    /* REPLY: yorum, parent yorumun sahibine gider */
    if (senderId.equals(parentComment.authorId)) return null;

    createNotification(parentComment.authorId, "post_reply", {
      title: "Yeni Yorum",
      message: `${user.firstName || "Birisi"} yorumuna yanıt verdi.`,
      senderId: user._id,
      relatedId: newCommentId,
      linkNotification,
      relatedModel: "PostComment",
    });

    return;
  }

  /* TOP-LEVEL COMMENT: parentCommentId yok, yorum post sahibine gider */
  if (senderId.equals(post.authorId)) return null;

  createNotification(post.authorId, "post_comment", {
    title: "Yeni Yorum",
    message: `${user.firstName || "Birisi"} gönderine yeni bir yorum yaptı.`,
    senderId: user._id,
    relatedId: newCommentId,
    linkNotification,
    relatedModel: "PostComment",
  });
};
