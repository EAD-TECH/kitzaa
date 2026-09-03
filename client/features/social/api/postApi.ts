import { apiFetch } from "@/lib/api/client";
import type { ListSocialPostsParams, NearbyPostsResponse, PostLikeResponse, PostListResponse, PostResponse } from "../types/post.types";
import { CreatePostInput, UpdatePostInput } from "../validations/post.schema";


export const createSocialPost = async (payload: CreatePostInput) => {
  return apiFetch<PostResponse>(`/api/v1/posts`, {
    method: "POST",
    body: payload,
  });
};

export const updateSocialPost = async (id: string, payload: UpdatePostInput) => {
  return apiFetch<PostResponse>(`/api/v1/posts/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteSocialPost = async (id: string): Promise<void> => {
  return apiFetch<void>(`/api/v1/posts/${id}`, {
    method: "DELETE",
  });
};

export const listSocialPosts = async ({page, limit, city, eventId, sort, search}: ListSocialPostsParams) => {

  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page)); //URLSearchParams.set() string ister. Ama bizim:page: number Bu yüzden:String(params.page) ile: numberi stringe ceviriyouz

  searchParams.set("limit", String(limit));

  if(city){
    searchParams.set("filter[city]", city);
  }

  if(eventId){
    searchParams.set("filter[eventId]", eventId);
  }

  if (sort?.createdAt) {
    searchParams.set("sort[createdAt]", String(sort.createdAt));
  }

  if (search) {
    searchParams.set("search[text]", search);
  }


  return apiFetch<PostListResponse>(`/api/v1/posts?${searchParams.toString()}` , {
    method: "GET",
  });
};

export const getSocialPost = async (id: string) => {
  return apiFetch<PostResponse>(`/api/v1/posts/${id}`, {
    method: "GET",
  });
};

export const likeSocialPost = async (id: string) => {
  return apiFetch<PostLikeResponse>(`/api/v1/posts/${id}/like`, { method: "POST" });
};

export const myPosts = async () => {

    return apiFetch<PostListResponse>(`/api/v1/posts/my-posts`, { method: "GET" })
}

export const nearbyPosts = async (lat: number, lng: number, radius?: number) => {

    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
    if (radius !== undefined) params.set("radius", String(radius))

    return apiFetch<NearbyPostsResponse>(`/api/v1/posts/nearby?${params}`, { method: "GET" })
}