"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toEventCategoryDTO } from "../../helpers/toEventCategoryDTO.js";
import EventCategory from "../../models/eventCategoryModel.js";
import type { CreateEventCategoryInput, UpdateEventCategoryInput } from "../../validations/eventCategory.schema.js";

const adminEventCategoryController = {

  create: async (req: Request<{}, any, CreateEventCategoryInput>, res: Response) => {
    const validatedData = req.body;

    const categoryExists = await EventCategory.findOne({ name: validatedData.name });

    if (categoryExists) {
      throw new CustomError('Category name is already registered.', 409);
    }

    const newCategory = await EventCategory.create(validatedData);

    res.status(201).send({
      error: false,
      category: toEventCategoryDTO(newCategory)
    });
  },

  list: async (req: Request, res: Response) => {
    const result = await res.getModelList(EventCategory);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(EventCategory),
      categories: toEventCategoryDTO(result)
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await EventCategory.findById(req.params.id);

    if (!result) {
      throw new CustomError('Category not found', 404);
    }

    res.status(200).send({
      error: false,
      category: toEventCategoryDTO(result)
    });
  },

  update: async (req: Request<{ id: string }, any, UpdateEventCategoryInput>, res: Response) => {
    const category = await EventCategory.findById(req.params.id);

    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    Object.assign(category, req.body);
    await category.save();

    res.status(200).send({
      error: false,
      category: toEventCategoryDTO(category)
    });
  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    const result = await EventCategory.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomError('Category not found or already deleted.', 404);
    }

    res.sendStatus(204);
  }

};

export default adminEventCategoryController;
