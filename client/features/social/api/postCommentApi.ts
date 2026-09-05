import { apiFetch } from "@/lib/api/client";
import type {
  ListPostCommentsParams,
  PostCommentLikeResponse,
  PostCommentListResponse,
  PostCommentResponse,
} from "../types/postComment.types";
import type { CreatePostCommentInput, UpdatePostCommentInput } from "../validations/postComment.schema";


export const createSocialPostComment = async (payload: CreatePostCommentInput) => {
  return apiFetch<PostCommentResponse>(`/api/v1/comments`, {
    method: "POST",
    body: payload,
  });
};

export const updateSocialPostComment = async (id: string, payload: UpdatePostCommentInput) => {
  return apiFetch<PostCommentResponse>(`/api/v1/comments/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteSocialPostComment = async (id: string): Promise<void> => {
  return apiFetch<void>(`/api/v1/comments/${id}`, {
    method: "DELETE",
  });
};

export const listSocialPostComments = async ({
  postId,
  page,
  limit,
  sort,
}: ListPostCommentsParams) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  searchParams.set("filter[postId]", postId);

  if (sort?.createdAt) {
    searchParams.set("sort[createdAt]", String(sort.createdAt));
  }

  return apiFetch<PostCommentListResponse>(
    `/api/v1/comments?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );
};

export const likeSocialPostComment = async (id: string) => {
  return apiFetch<PostCommentLikeResponse>(`/api/v1/comments/${id}/like`, { method: "POST" });
};



