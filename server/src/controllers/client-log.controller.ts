import type { Request, Response } from "express";
import { HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import type { BodyRequest } from "../types/auth.js";
import type { ClientLogRequest } from "../types/client-log.js";
import { parseClientLogRequest } from "../utils/client-log-validation.js";
import { logFailure } from "../utils/log.js";

export const clientLogController = {
  create(req: BodyRequest<ClientLogRequest>, res: Response): void {
    try {
      const entry = parseClientLogRequest(req.body);
      req.log.log(entry.level, `[web] ${entry.message}`, {
        event: LogEvent.ClientError,
        source: entry.source,
        pageUrl: entry.url,
        stack: entry.stack,
        userId: req.user?.id,
        userAgent: req.get("user-agent"),
      });

      res.status(HttpStatus.NoContent).end();
    } catch (err) {
      throw logFailure(req as Request, LogEvent.ClientLogFailed, "Save client log failed", err);
    }
  },
};
