import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";
import { LogLevel } from "../constants/log.js";

const SafeRequestId = /^[\w-]{8,64}$/;
const QuietPaths = new Set(["/api/v1/health"]);

const pathOf = (req: Request): string => req.originalUrl.split("?")[0];

const levelFor = (req: Request, status: number): LogLevel => {
  if (status >= 500) return LogLevel.Error;
  if (status >= 400) return LogLevel.Warn;
  if (QuietPaths.has(pathOf(req))) return LogLevel.Debug;
  
  return LogLevel.Http;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();
  const incoming = req.header("x-request-id");

  req.id = incoming && SafeRequestId.test(incoming) ? incoming : randomUUID();
  req.log = logger.child({ requestId: req.id });
  res.setHeader("X-Request-Id", req.id);

  res.on("finish", () => {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e4) / 100;
    const status = res.statusCode;

    const meta = status >= 400 ? { userId: req.user?.id, ip: req.ip } : { userId: req.user?.id };

    req.log.log(levelFor(req, status), `${req.method} ${pathOf(req)} ${status} ${durationMs}ms`, meta);
  });

  next();
};
