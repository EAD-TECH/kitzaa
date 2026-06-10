"use strict";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).send({
    error: true,
    message: err.message,
    cause: err.cause,
    // stack: err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};