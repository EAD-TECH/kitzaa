"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toPostDTO } from "../../helpers/toPostDTO.js";
import Event from "../../models/eventModel.js";
import Post from "../../models/postModel.js";
import type { CreatePostInput, UpdatePostInput } from "../../validations/post.schema.js";
import type { PostDocument } from "../../types/post.types.js";

const socialPostController = {
  list: async (req: Request, res: Response) => {
    const customFilter = { isDeleted: false };

    const result = await res.getModelList(Post, customFilter, [
      { path: "authorId", select: "username firstName lastName avatarUrl" },
      { path: "eventId", select: "title slug" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Post, customFilter),
      posts: toPostDTO(result, req.user._id),
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await Post.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
      { path: "eventId", select: "title slug" },
    ]);

    if (!result) {
      throw new CustomError("Post not found", 404);
    }

    res.status(200).send({
      error: false,
      post: toPostDTO(result, req.user._id),
    });
  },

  create: async (req: Request<{}, any, CreatePostInput>, res: Response) => {
    const validatedData = req.body;
    const userId = req.user._id;

    if (validatedData.eventId) {
      const event = await Event.findById(validatedData.eventId).select("_id");
      if (!event) {
        throw new CustomError("Event not found", 404);
      }
    }

    const newPostData = await Post.create({
      ...validatedData,
      authorId: userId,
    });

    await newPostData.populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
      { path: "eventId", select: "title slug" },
    ]);

    res.status(201).send({
      error: false,
      post: toPostDTO(newPostData, userId),
    });
  },

  update: async (req: Request<{ id: string }, any, UpdatePostInput>, res: Response) => {
    // isOwnerOrAdmin middleware sahiplik/admin kontrolunu yapip post'u req.resource'a koyuyor.
    const post = req.resource as PostDocument;

    if (post.isDeleted) {
      throw new CustomError("Post not found", 404);
    }

    if (req.body.eventId) {
      const event = await Event.findById(req.body.eventId).select("_id");
      if (!event) {
        throw new CustomError("Event not found", 404);
      }
    }

    Object.assign(post, req.body);
    await post.save();

    await post.populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
      { path: "eventId", select: "title slug" },
    ]);

    res.status(200).send({
      error: false,
      post: toPostDTO(post, req.user._id),
    });
  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    // isOwnerOrAdmin middleware sahiplik/admin kontrolunu yapip post'u req.resource'a koyuyor.
    const post = req.resource as PostDocument;

    if (post.isDeleted) {
      throw new CustomError("Post not found", 404);
    }

    post.isDeleted = true;
    await post.save();

    res.sendStatus(204);
  },

  toggleLike: async (req: Request<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const userId = req.user._id;

    // Soft-delete edilmis posta like basilamaz (event'te isDeleted yok; post'ta var).
    const post = await Post.findOne({ _id: postId, isDeleted: false });

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    const alreadyLiked = post.likes?.some((id) => id.equals(userId)) ?? false;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, isDeleted: false },
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true },
    ).populate([
      { path: "authorId", select: "username firstName lastName avatarUrl" },
      { path: "eventId", select: "title slug" },
    ]);

    if (!updatedPost) {
      throw new CustomError("Post not found", 404);
    }

    res.status(200).send({
      error: false,
      liked: !alreadyLiked,
      post: toPostDTO(updatedPost, userId),
    });
  },
};

export default socialPostController;
