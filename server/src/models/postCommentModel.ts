import { mongoose } from "../configs/dbConnection.js";
import type { IPostComment, PostCommentModel } from "../types/postComment.types.js";

const postCommentSchema = new mongoose.Schema<IPostComment, PostCommentModel>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    text: {
      type: String,
      required: [true, "Text is required"],
      trim: true,
      maxlength: [1000, "Text cannot exceed 1000 characters"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "postComments", timestamps: true },
);

// Post altindaki yorum listesi: en yeni once
postCommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model<IPostComment, PostCommentModel>("PostComment", postCommentSchema);
