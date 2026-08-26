"use strict";

import type { Request, Response, NextFunction } from "express";
import type { QueryHandlerQuery } from "../types/queryHandler.types.js";
import type { Model, PopulateOption, PopulateOptions } from "mongoose";

const queryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const query = req.query as QueryHandlerQuery

  //* Filter:
  const filter = query.filter ?? {};

  //* Search:
  const search = query.search ?? {};

  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  //* Sorting:
  const sort = query.sort ?? {};

  //? PAGINATION:
  // URL?page=3&limit=10&skip=20

  const page = Number(query.page) > 0 ? Number(query.page) : 1;

  const limit = Number(query.limit) > 0 ? Number(query.limit) : 6;

  //* Skip:

  const skip =
    Number(query.skip) > 0
      ? Number(query.skip)
      : (page - 1) * limit;



  res.getModelList = async <T>(
    model: Model<T>,
    customFilter: Record<string, unknown> = {},
    populate?: string | PopulateOptions | (string | PopulateOptions)[]
  ): Promise<T[]> => {
    const query = model
      .find({
        ...filter,
        ...search,
        ...customFilter,
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      const normalizedPopulate =
        typeof populate === "string" ? [populate] : populate;
      query.populate(normalizedPopulate);
    }

    return await query;
  };


  res.getModelListDetails = async <T>(
    model: Model<T>,
    customFilter: Record<string, unknown> = {}
  ) => {
    const count = await model.countDocuments({
      ...filter,
      ...search,
      ...customFilter,
    });

    return {
      count,
      filter,
      search,
      page,
      skip,
      limit,
      sort,
      pages:
        count <= limit
          ? false
          : {
            previous: page > 1 ? page - 1 : false,
            current: page,
            next: page < Math.ceil(count / limit) ? page + 1 : false,
            total: Math.ceil(count / limit),
          },
    };
  };

  next();

};

export default queryHandler;
