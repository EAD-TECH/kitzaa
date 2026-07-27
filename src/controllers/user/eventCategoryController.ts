"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toEventCategoryDTO } from "../../helpers/toEventCategoryDTO.js";
import EventCategory from "../../models/eventCategoryModel.js";

const eventCategoryController = {

  list: async (req: Request, res: Response) => {
    const customFilter = { isActive: true };

    const result = await res.getModelList(EventCategory, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(EventCategory, customFilter),
      categories: toEventCategoryDTO(result)
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await EventCategory.findOne({ _id: req.params.id, isActive: true });

    if (!result) {
      throw new CustomError('Category not found', 404);
    }

    res.status(200).send({
      error: false,
      category: toEventCategoryDTO(result)
    });
  }

};

export default eventCategoryController;
