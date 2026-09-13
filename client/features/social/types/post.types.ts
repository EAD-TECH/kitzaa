/** DTO icinde populate edilmis yazar ozeti */
export interface PostAuthorSummary {
  _id: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

/** DTO icinde opsiyonel event etiketi ozeti */
export interface PostEventTagSummary {
  _id: string;
  title: string;
  slug: string;
}

/** Serbest mekan icin sadece koordinat (adres Event'te kalir) */
export interface PostLocation {
  lat: number;
  lng: number;
}

export interface PostDTO {
  _id: string;
  author: PostAuthorSummary;
  text: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  event: PostEventTagSummary | null;
  placeName: string | null;
  city: string | null;
  location: PostLocation | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// res.getModelListDetails'in döndüğü sayfalama bilgisi (server/src/middlewares/queryHandler.ts)
export interface PostListDetails {
  count: number;
  filter: Record<string, unknown>;
  search: Record<string, unknown>;
  page: number;
  skip: number;
  limit: number;
  sort: Record<string, unknown>;
  pages:
    | false
    | {
        previous: number | false;
        current: number;
        next: number | false;
        total: number;
      };
}

export interface NearbyPostsResponse {
  error: false;
  posts: PostDTO[];
}

//listSocialPosts func ina 4 ayri parametre vermek yerine bunu bi obede toplamak daha mantikli geldi 
export interface ListSocialPostsParams {
  page: number;
  limit: number;
  city?: string;
  eventId?: string;
  sort?: {
    createdAt?: 1 | -1;
  };
  search?: string;
}

export interface UsePostsParams {
  city?: string;
  eventId?: string;
  sort?: {
    createdAt?: 1 | -1;
  };
  search?: string;
}


// Backend'in tüm post endpoint'leri response'u bir zarfın içinde döner — apiFetch<PostDTO>
// diye çıplak DTO beklemek yanlış, her endpoint kendi zarf şeklini kullanmalı.
export interface PostListResponse {
  error: false;
  details: PostListDetails;
  posts: PostDTO[];
}


export interface PostResponse {
  error: false;
  post: PostDTO;
}

export interface PostLikeResponse {
  error: false;
  liked: boolean;
  post: PostDTO;
}
