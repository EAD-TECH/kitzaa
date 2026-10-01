import type { PostAuthorSummary, PostListDetails } from "./post.types";

export interface PostCommentDTO {
  _id: string;
  postId: string;
  author: PostAuthorSummary;
  text: string;
  likesCount: number;
  isLikedByMe: boolean;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostCommentListResponse {
  error: false;
  details: PostListDetails;
  comments: PostCommentDTO[];
}

export interface PostCommentResponse {
  error: false;
  comment: PostCommentDTO;
}

export interface PostCommentLikeResponse {
  error: false;
  liked: boolean;
  comment: PostCommentDTO;
}

export interface ListPostCommentsParams {
  postId: string;
  page: number;
  limit: number;
  sort?: {
    createdAt?: 1 | -1;
  };
}
