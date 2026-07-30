import type { Types, Model, HydratedDocument } from 'mongoose';
import type { PostAuthorSummary } from './post.types.js';

export interface IPostComment {
  _id?: Types.ObjectId;
  postId: Types.ObjectId; // ref Post
  authorId: Types.ObjectId; // ref User
  text: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PostCommentModel = Model<IPostComment>;
export type PostCommentDocument = HydratedDocument<IPostComment>;

export interface PostCommentDTO {
  _id: string;
  postId: string;
  author: PostAuthorSummary;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}