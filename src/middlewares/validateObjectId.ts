"use strict";

import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import CustomError from "../helpers/customError.js";

// Tek bir route'a elle eklemek icin (ozel parametre adlari, orn. :categoryId)
export const validateObjectId = (paramName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!isValidObjectId(req.params[paramName])) {
            throw new CustomError(`Invalid ${paramName}.`, 400);
        }
        next();
    };
};

// router.param('id', ...) ile bir router'daki tum ":id" route'larina toplu baglamak icin
export const validateObjectIdParam = (
    req: Request,
    res: Response,
    next: NextFunction,
    value: string
): void => {
    if (!isValidObjectId(value)) {
        throw new CustomError('Invalid id.', 400);
    }
    next();
};
