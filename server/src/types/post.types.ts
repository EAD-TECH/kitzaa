import type { Types, Model, HydratedDocument } from 'mongoose';

/** Serbest mekan icin sadece koordinat (adres Event'te kalir) */
export interface IPostLocation {
  lat: number;
  lng: number;
}

export interface IPost {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId; // ref User
  text: string;
  imageUrl?: string | null;
  likes: Types.ObjectId[]; // ref User[]
  commentsCount: number;
  eventId?: Types.ObjectId | null; // ref Event — opsiyonel etiket
  placeName?: string | null;
  city?: string | null;
  location?: IPostLocation | null;
  isDeleted: boolean;
  viewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PostModel = Model<IPost>;
export type PostDocument = HydratedDocument<IPost>;

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

/**
 * API cevabi — ham likes[] yok; likesCount + isLikedByMe.
 * toPostDTO (SOC-010) bu shape'i uretecek.
 */
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
  location: IPostLocation | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
