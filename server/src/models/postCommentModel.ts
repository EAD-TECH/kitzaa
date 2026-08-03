import { mongoose } from '../configs/dbConnection.js';
import type { IPostComment, PostCommentModel } from '../types/postComment.types.js';

const postCommentSchema = new mongoose.Schema<IPostComment, PostCommentModel>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    text: {
      type: String,
      required: [true, 'Text is required'],
      trim: true,
      maxlength: [1000, 'Text cannot exceed 1000 characters'],
    },

    // Post / Event ile ayni like array stili
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // null = top-level; set = reply (2 seviyeli thread)
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostComment',
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'postComments', timestamps: true },
);

// Feed: post altindaki tum yorumlar (en yeni once)
postCommentSchema.index({ postId: 1, createdAt: -1 });

// Thread: top-level (parent null) veya bir yoruma ait cevaplar
postCommentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

export default mongoose.model<IPostComment, PostCommentModel>('PostComment', postCommentSchema);
