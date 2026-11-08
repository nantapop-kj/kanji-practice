import type { NextFunction, Request, Response } from "express";
import { errorMeta, logger } from "../config/logger.js";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { HttpError } from "../utils/http-error.js";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof Error && "status" in err && err.status === HttpStatus.BadRequest) {
    res.status(HttpStatus.BadRequest).json({ error: { code: ErrorCode.BadRequest, message: "Invalid request body" } });
    return;
  }
  
  if (err instanceof Error && "status" in err && err.status === HttpStatus.PayloadTooLarge) {
    res
      .status(HttpStatus.PayloadTooLarge)
      .json({ error: { code: ErrorCode.PayloadTooLarge, message: "Request body is too large" } });
    return;
  }

  (req.log ?? logger).error(`Unhandled error on ${req.method} ${req.originalUrl.split("?")[0]}`, {
    error: errorMeta(err),
    userId: req.user?.id,
  });

  res
    .status(HttpStatus.InternalServerError)
    .json({ error: { code: ErrorCode.InternalError, message: "Something went wrong" } });
};
