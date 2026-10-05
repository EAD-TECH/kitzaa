"use client";

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { flattenPages, getNextPageParam } from "@/lib/api/pagination";

import {
  createSocialPostComment,
  deleteSocialPostComment,
  likeSocialPostComment,
  listSocialPostComments,
} from "../api/postCommentApi";
import {
  createSocialPost,
  deleteSocialPost,
  getSocialPost,
  likeSocialPost,
  listSocialPosts,
  myPosts,
  updateSocialPost,
} from "../api/postApi";
import type { PostCommentListResponse } from "../types/postComment.types";
import type { PostListResponse, UsePostsParams } from "../types/post.types";
import type { CreatePostCommentInput } from "../validations/postComment.schema";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../validations/post.schema";
import { useTrackActions } from "@/features/socket/hooks/useTrackActions";

const POST_CREATE_ERROR_MESSAGES: Record<string, string> = {};
const POST_UPDATE_ERROR_MESSAGES: Record<string, string> = {};
const COMMENT_CREATE_ERROR_MESSAGES: Record<string, string> = {};
const COMMENT_DELETE_ERROR_MESSAGES: Record<string, string> = {};

// Backend CustomError.message → kullanıcıya gösterilen Almanca metin.
// Key'ler sunucudaki string ile birebir aynı olmalı (isOwnerOrAdmin + comment deletee).
const POST_DELETE_ERROR_MESSAGES: Record<string, string> = {
  "You do not have permission to perform this action.":
    "Du darfst diesen Beitrag nicht löschen.",
  "Post not found": "Beitrag wurde nicht gefunden.",
  "Resource not found": "Beitrag wurde nicht gefunden.",
  "Invalid resource id.": "Ungültige Beitrags-ID.",
  "Invalid id.": "Ungültige Beitrags-ID.",
};

export const usePosts = ({
  city,
  eventId,
  sort,
  search,
}: UsePostsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["social-posts", { city, eventId, sort, search }],
    queryFn: ({ pageParam }) =>
      listSocialPosts({
        page: pageParam,
        limit: 5,
        city,
        eventId,
        sort,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.details.pages && lastPage.details.pages.next;
      return next === false ? undefined : next;
    },
  });
};

// Infinite olması ayrıca şart: useTogglePostLike ["social-posts"] önekindeki tüm
// cache'leri InfiniteData varsayarak (oldData.pages) günceller.
export function useMyPosts({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["social-posts", "my-posts"],
    queryFn: ({ pageParam }) => myPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam,
    enabled,
  });

  return {
    posts: flattenPages(data?.pages, (page) => page.posts),
    count: data?.pages[0]?.details.count,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export function usePostById(postId: string) {
  return useQuery({
    queryKey: ["social-post", postId],
    queryFn: () => getSocialPost(postId),
    enabled: Boolean(postId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deleteSocialPost(postId),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (POST_DELETE_ERROR_MESSAGES[error.message] ??
            "Post konnte nicht gelöscht werden. Bitte versuche es erneut.")
          : "Post konnte nicht gelöscht werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (_response, postId) => {
      toast.success("Post erfolgreich gelöscht.");
      queryClient.invalidateQueries({
        queryKey: ["social-post", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["social-posts"],
      });
    },
  });
};

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ["social-post-comments", postId],
    queryFn: () =>
      listSocialPostComments({
        postId,
        page: 1,
        limit: 20,
        sort: { createdAt: -1 },
      }),
    enabled: Boolean(postId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { handleTrackActions } = useTrackActions();

  return useMutation({
    mutationFn: (postData: CreatePostInput) => createSocialPost(postData),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (POST_CREATE_ERROR_MESSAGES[error.message] ??
            "Beitrag konnte nicht erstellt werden. Bitte versuche es erneut.")
          : "Beitrag konnte nicht erstellt werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (response) => {
      toast.success("Beitrag erfolgreich erstellt.");
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });

      const user = queryClient.getQueryData<{
        firstName?: string;
        lastName?: string;
      }>(["currentUser"]);
      const userName = user ? `${user.firstName} ${user.lastName}` : "Biri";

      handleTrackActions({
        type: "post_create",
        title: "Yeni Gönderi Yorumu",
        description: `${userName} platformda yeni bir gönderi yayınladı.`,
        linkUrl: `/post/${response.post._id}`,
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostInput }) =>
      updateSocialPost(id, payload),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (POST_UPDATE_ERROR_MESSAGES[error.message] ??
            "Beitrag konnte nicht aktualisiert werden. Bitte versuche es erneut.")
          : "Beitrag konnte nicht aktualisiert werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (_response, variables) => {
      toast.success("Beitrag erfolgreich aktualisiert.");
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["social-post", variables.id],
      });
    },
  });
};

export const useDeletePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: string;
      postId: string;
    }) => deleteSocialPostComment(commentId),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (COMMENT_DELETE_ERROR_MESSAGES[error.message] ??
            "Kommentar konnte nicht gelöscht werden. Bitte versuche es erneut.")
          : "Kommentar konnte nicht gelöscht werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (_response, variablesId) => {
      toast.success("Kommentar erfolgreich gelöscht.");
      queryClient.invalidateQueries({
        queryKey: ["social-post-comments", variablesId.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["social-post", variablesId.postId],
      });
    },
  });
};

export const useCreatePostComment = () => {
  const queryClient = useQueryClient();
  const { handleTrackActions } = useTrackActions();

  return useMutation({
    mutationFn: (commentData: CreatePostCommentInput) =>
      createSocialPostComment(commentData),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (COMMENT_CREATE_ERROR_MESSAGES[error.message] ??
            "Kommentar konnte nicht erstellt werden. Bitte versuche es erneut.")
          : "Kommentar konnte nicht erstellt werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (_response, submittedComment) => {
      toast.success("Kommentar erfolgreich erstellt.");
      queryClient.invalidateQueries({
        queryKey: ["social-post-comments", submittedComment.postId],
      });

      const shortComment = submittedComment.text
        ? submittedComment.text.substring(0, 30) + "..."
        : "bir yorum yaptı.";

      const user = queryClient.getQueryData<{
        firstName?: string;
        lastName?: string;
      }>(["currentUser"]);
      const userName = user ? `${user.firstName} ${user.lastName}` : "Biri";

      queryClient.invalidateQueries({ queryKey: ["social-posts"] });

      handleTrackActions({
        type: "comment",
        title: "Yeni Gönderi Yorumu",
        description: `${userName}: "${shortComment}"`,
        relatedId: submittedComment.postId,
        linkUrl: `/post/${submittedComment.postId}`,
      });
    },
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  const { handleTrackActions } = useTrackActions();

  return useMutation({
    mutationFn: (id: string) => likeSocialPost(id),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["social-posts"] });

      const previousQueries = queryClient.getQueriesData<
        InfiniteData<PostListResponse>
      >({
        queryKey: ["social-posts"],
      });

      queryClient.setQueriesData<InfiniteData<PostListResponse>>(
        { queryKey: ["social-posts"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => {
                if (post._id !== postId) return post;

                return {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                };
              }),
            })),
          };
        },
      );

      return { previousQueries };
    },

    onError: (_error, _postId, context) => {
      context?.previousQueries.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<InfiniteData<PostListResponse>>(
        { queryKey: ["social-posts"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post._id === data.post._id ? data.post : post,
              ),
            })),
          };
        },
      );
      if (data.post.isLikedByMe) {
        const user = queryClient.getQueryData<{
          firstName?: string;
          lastName?: string;
        }>(["currentUser"]);
        const userName = user ? `${user.firstName} ${user.lastName}` : "Biri";

        handleTrackActions({
          type: "like",
          title: "Gönderi Beğenildi",
          description: `${userName} bir gönderiyi beğendi.`,
          relatedId: data.post._id,
          linkUrl: `/post/${data.post._id}`,
        });
      }
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      likeSocialPostComment(commentId),
    onMutate: async ({ commentId, postId }) => {
      const queryKey = ["social-post-comments", postId];

      await queryClient.cancelQueries({ queryKey });

      const previousQueries =
        queryClient.getQueriesData<PostCommentListResponse>({
          queryKey,
        });

      queryClient.setQueryData<PostCommentListResponse>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          comments: oldData.comments.map((comment) => {
            if (comment._id !== commentId) return comment;

            return {
              ...comment,
              isLikedByMe: !comment.isLikedByMe,
              likesCount: comment.isLikedByMe
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            };
          }),
        };
      });

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },
    onSuccess: (data, { postId }) => {
      queryClient.setQueryData<PostCommentListResponse>(
        ["social-post-comments", postId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: oldData.comments.map((comment) =>
              comment._id === data.comment._id ? data.comment : comment,
            ),
          };
        },
      );
    },
  });
};
