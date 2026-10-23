import type { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/customError.js";
import { isProfileComplete } from "../helpers/profileCompletion.js";

const requireCompleteProfile = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!isProfileComplete(req.user)) {
    throw new CustomError("Profile is incomplete.", 403);
  }

  next();
};

export default requireCompleteProfile;
