import type { Request } from "express";
import { LogEvent, LogLevel } from "../constants/log.js";
import { HttpError } from "./http-error.js";

export const logFailure = <T>(req: Request, event: LogEvent, message: string, err: T): T => {
  const level = err instanceof HttpError && err.status < 500 ? LogLevel.Warn : LogLevel.Error;

  req.log.log(level, message, {
    event,
    userId: req.user?.id,
    ip: req.ip,
    error: err instanceof Error ? err.message : String(err),
  });

  return err;
};
