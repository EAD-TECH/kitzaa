"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toPostDTO } from "../../helpers/toPostDTO.js";
import Event from "../../models/eventModel.js";
import Post from "../../models/postModel.js";
import type { CreatePostInput } from "../../validations/post.schema.js";
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
};

export default socialPostController;
