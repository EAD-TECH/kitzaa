import type { Types } from 'mongoose';
import type {
  PostAuthorSummary,
  PostDocument,
  PostDTO,
  PostEventTagSummary,
} from '../types/post.types.js';
import type { UserDocument } from '../types/user.types.js';
import type { EventDocument } from '../types/event.types.js';

type CurrentUserId = string | Types.ObjectId | null | undefined;

function toAuthorSummary(post: PostDocument): PostAuthorSummary {
  const populatedId = post.populated('authorId');

  if (!populatedId) {
    return { _id: post.authorId.toString() };
  }

  const user = post.authorId as unknown as UserDocument | null;

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

function toEventTagSummary(post: PostDocument): PostEventTagSummary | null {
  if (!post.eventId) {
    return null;
  }

  const populatedId = post.populated('eventId');

  if (!populatedId) {
    return null;
  }

  const event = post.eventId as unknown as EventDocument | null;

  if (!event) {
    return null;
  }

  return {
    _id: event._id!.toString(),
    title: event.title,
    slug: event.slug,
  };
}

function isLikedByUser(post: PostDocument, currentUserId: CurrentUserId): boolean {
  if (!currentUserId) {
    return false;
  }

  const userId = currentUserId.toString();
  return (post.likes ?? []).some((likeId) => likeId.toString() === userId);
}

// Function overloads
export function toPostDTO(post: PostDocument, currentUserId?: CurrentUserId): PostDTO;
export function toPostDTO(post: PostDocument[], currentUserId?: CurrentUserId): PostDTO[];
export function toPostDTO(
  post: PostDocument | PostDocument[] | null,
  currentUserId?: CurrentUserId,
): PostDTO | PostDTO[] | null;

// Implementation
export function toPostDTO(
  post: PostDocument | PostDocument[] | null,
  currentUserId?: CurrentUserId,
): PostDTO | PostDTO[] | null {
  if (!post) return null;

  if (Array.isArray(post)) {
    return post.map((item) => toPostDTO(item, currentUserId));
  }

  return {
    _id: post._id!.toString(),
    author: toAuthorSummary(post),
    text: post.text,
    imageUrl: post.imageUrl ?? null,
    likesCount: post.likes?.length ?? 0,
    commentsCount: post.commentsCount ?? 0,
    isLikedByMe: isLikedByUser(post, currentUserId),
    event: toEventTagSummary(post),
    placeName: post.placeName ?? null,
    city: post.city ?? null,
    location: post.location ?? null,
    viewCount: post.viewCount ?? 0,
    createdAt: post.createdAt!,
    updatedAt: post.updatedAt!,
  };
}
