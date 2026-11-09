import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { RateLimitCleanupIntervalMs } from "../constants/rate-limit.js";
import { HttpError } from "../utils/http-error.js";

type RateLimitOptions = {
  name: string;
  windowMs: number;
  max: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

export const rateLimit = ({ name, windowMs, max }: RateLimitOptions): RequestHandler => {
  const buckets = new Map<string, Bucket>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }, RateLimitCleanupIntervalMs).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });

      next();
      return;
    }

    bucket.count++;
    if (bucket.count <= max) {
      next();
      return;
    }

    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    if (bucket.count === max + 1) {
      req.log.warn("Rate limit exceeded", { event: LogEvent.RateLimited, limit: name, ip: req.ip, retryAfter });
    }

    throw new HttpError(
      HttpStatus.TooManyRequests,
      ErrorCode.TooManyRequests,
      `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minute(s)`,
    );
  };
};
