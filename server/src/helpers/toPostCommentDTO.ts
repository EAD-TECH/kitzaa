import type { Types } from 'mongoose';
import type { PostCommentDocument, PostCommentDTO } from '../types/postComment.types.js';
import type { PostAuthorSummary } from '../types/post.types.js';
import type { UserDocument } from '../types/user.types.js';

type CurrentUserId = string | Types.ObjectId | null | undefined;

function toAuthorSummary(comment: PostCommentDocument): PostAuthorSummary {
  const populatedId = comment.populated('authorId');

  if (!populatedId) {
    return { _id: comment.authorId.toString() };
  }

  const user = comment.authorId as unknown as UserDocument | null;

  if (!user) {
    return { _id: populatedId.toString() };
  }

  return {
    _id: user._id!.toString(),
    username: user.username,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    avatarUrl: user.avatarUrl ?? null,
  };
}

function isLikedByUser(comment: PostCommentDocument, currentUserId: CurrentUserId): boolean {
  if (!currentUserId) {
    return false;
  }

  const userId = currentUserId.toString();
  return (comment.likes ?? []).some((likeId) => likeId.toString() === userId);
}

function toParentCommentId(comment: PostCommentDocument): string | null {
  if (comment.parentCommentId == null) {
    return null;
  }

  // DTO'da sadece id; parent populate edilmez. Yanlislikla populate
  // edildiyse dokumanin _id'sini al (toPostDTO dangling-ref stili).
  if (comment.populated('parentCommentId')) {
    const parent = comment.parentCommentId as unknown as { _id?: Types.ObjectId } | null;
    return parent?._id?.toString() ?? null;
  }

  return comment.parentCommentId.toString();
}

// Function overloads
export function toPostCommentDTO(
  comment: PostCommentDocument,
  currentUserId?: CurrentUserId,
): PostCommentDTO;
export function toPostCommentDTO(
  comment: PostCommentDocument[],
  currentUserId?: CurrentUserId,
): PostCommentDTO[];
export function toPostCommentDTO(
  comment: PostCommentDocument | PostCommentDocument[] | null,
  currentUserId?: CurrentUserId,
): PostCommentDTO | PostCommentDTO[] | null;

// Implementation
export function toPostCommentDTO(
  comment: PostCommentDocument | PostCommentDocument[] | null,
  currentUserId?: CurrentUserId,
): PostCommentDTO | PostCommentDTO[] | null {
  if (!comment) return null;

  if (Array.isArray(comment)) {
    return comment.map((item) => toPostCommentDTO(item, currentUserId));
  }

  return {
    _id: comment._id!.toString(),
    postId: comment.postId.toString(),
    author: toAuthorSummary(comment),
    text: comment.text,
    likesCount: comment.likes?.length ?? 0,
    isLikedByMe: isLikedByUser(comment, currentUserId),
    parentCommentId: toParentCommentId(comment),
    createdAt: comment.createdAt!,
    updatedAt: comment.updatedAt!,
  };
}
