"use strict";

import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).send({
    error: true,
    message: err.message,
    cause: err.cause,
    // stack: err.stack,
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};
