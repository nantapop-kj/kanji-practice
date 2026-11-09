import type { Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { statsService } from "../services/stats.service.js";
import type { StatsResponse } from "../types/stats.js";
import { HttpError } from "../utils/http-error.js";
import { logFailure } from "../utils/log.js";

const userIdOf = (req: Request): string => {
  if (!req.user) throw new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, "Authentication required");

  return req.user.id;
};

export const statsController = {
  async get(req: Request, res: Response<StatsResponse>): Promise<void> {
    try {
      res.json(await statsService.getForUser(userIdOf(req)));
    } catch (err) {
      throw logFailure(req, LogEvent.StatsGetFailed, "Get stats failed", err);
    }
  },

  async reset(req: Request, res: Response): Promise<void> {
    try {
      await statsService.resetForUser(userIdOf(req));
      req.log.info("Stats reset", { event: LogEvent.StatsReset, userId: req.user?.id });

      res.status(HttpStatus.NoContent).end();
    } catch (err) {
      throw logFailure(req, LogEvent.StatsResetFailed, "Reset stats failed", err);
    }
  },
};
