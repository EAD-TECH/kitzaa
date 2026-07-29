import { mongoose } from '../configs/dbConnection.js';
import type { IPost, IPostLocation, PostModel } from '../types/post.types.js';

// Embedded
const locationSchema = new mongoose.Schema<IPostLocation>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema<IPost, PostModel>(
  {
    // Kim yazdi — User ref; feed/filtre icin index
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
      trim: true,
      maxlength: [5000, 'Text cannot exceed 5000 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Yorum sayisi — denormalize; comment CRUD artirir/azaltir
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    //Kullanici katildigi eventa göstermek isterse diye bu field var
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
      index: true,
    },
    placeName: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    location: {
      type: locationSchema,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { collection: 'posts', timestamps: true },
);

// Feed: en yeni once (isDeleted filtreleriyle birlikte kullanilir)
postSchema.index({ createdAt: -1 });

export default mongoose.model<IPost, PostModel>('Post', postSchema);
