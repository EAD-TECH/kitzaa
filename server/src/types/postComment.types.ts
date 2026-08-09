import type { Types, Model, HydratedDocument } from 'mongoose';
import type { PostAuthorSummary } from './post.types.js';

/**
 * Social post comments — Instagram/YouTube tarzı 2 seviyeli thread:
 * - parentCommentId === null  → top-level yorum
 * - parentCommentId === <top> → o yoruma cevap
 * Derin agac (Reddit) yok; reply-to-reply create'de top-level parent'a baglanir / reddedilir
 * (controller sorumlulugu).
 */
export interface IPostComment {
  _id?: Types.ObjectId;
  postId: Types.ObjectId; // ref Post
  authorId: Types.ObjectId; // ref User
  text: string;
  likes: Types.ObjectId[]; // ref User[]
  parentCommentId?: Types.ObjectId | null; // ref PostComment — null = top-level
  mentionedUserIds?:Types.ObjectId[]
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PostCommentModel = Model<IPostComment>;
export type PostCommentDocument = HydratedDocument<IPostComment>;

/**
 * API cevabi — ham likes[] yok; likesCount + isLikedByMe (PostDTO ile ayni sozlesme).
 * Flat liste + parentCommentId; FE agaci kurar (nested replies[] donulmez).
 */
export interface PostCommentDTO {
  _id: string;
  postId: string;
  author: PostAuthorSummary;
  text: string;
  likesCount: number;
  isLikedByMe: boolean;
  parentCommentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
