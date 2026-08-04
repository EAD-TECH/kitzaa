"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toPostCommentDTO } from "../../helpers/toPostCommentDTO.js";
import PostComment from "../../models/postCommentModel.js";
import Post from "../../models/postModel.js";
import type {
  CreatePostCommentInput,
  UpdatePostCommentInput,
} from "../../validations/postComment.schema.js";
import type { PostCommentDocument } from "../../types/postComment.types.js";

const socialPostCommentController = {
  list: async (req: Request, res: Response) => {
      const customFilter = { isDeleted: false };
  
      const result = await res.getModelList(PostComment, customFilter, [
        { path: "authorId", select: "username firstName lastName avatarUrl" }
      ]);
  
      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(PostComment, customFilter),
        comments: toPostCommentDTO(result, req.user._id),
      });
    },

  create: async (req: Request<{}, any, CreatePostCommentInput>, res: Response) => {
    const validatedData = req.body;
    const userId = req.user._id;

    const post = await Post.findOne({ _id: validatedData.postId, isDeleted: false });
    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    if (validatedData.parentCommentId) {
      const parentComment = await PostComment.findOne({
        _id: validatedData.parentCommentId,
        isDeleted: false,
      });

      if (!parentComment) {
        throw new CustomError("Parent comment not found", 404);
      }

      if (!parentComment.postId.equals(validatedData.postId)) {
        throw new CustomError("Parent comment does not belong to this post", 400);
      }

      // 2-level thread: reply sadece top-level yoruma olabilir
      if (parentComment.parentCommentId != null) {
        throw new CustomError("Cannot reply to a reply", 400);
      }
    }

    const newPostCommentData = await PostComment.create({
      ...validatedData,
      authorId: userId,
    });

    await Post.findOneAndUpdate(
      { _id: validatedData.postId, isDeleted: false },
      { $inc: { commentsCount: 1 } },
    );

    await newPostCommentData.populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
    ]);

    res.status(201).send({
      error: false,
      comment: toPostCommentDTO(newPostCommentData, userId),
    });
  },

  update: async (req: Request<{ id: string }, any, UpdatePostCommentInput>, res: Response) => {
    // isOwnerOrAdmin middleware sahiplik/admin kontrolunu yapip comment'i req.resource'a koyuyor.
    const comment = req.resource as PostCommentDocument;

    if (comment.isDeleted) {
      throw new CustomError("Comment not found", 404);
    }

    Object.assign(comment, req.body);
    await comment.save();

    await comment.populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
    ]);

    res.status(200).send({
      error: false,
      comment: toPostCommentDTO(comment, req.user._id),
    });
  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    // isOwnerOrAdmin middleware sahiplik/admin kontrolunu yapip comment'i req.resource'a koyuyor.
    const comment = req.resource as PostCommentDocument;

    if (comment.isDeleted) {
      throw new CustomError("Comment not found", 404);
    }

    comment.isDeleted = true;
    await comment.save();

    await Post.findOneAndUpdate(
      { _id: comment.postId, isDeleted: false },
      { $inc: { commentsCount: -1 } },
    );

    res.sendStatus(204);
  },
};

export default socialPostCommentController;
