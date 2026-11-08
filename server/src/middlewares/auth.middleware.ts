import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Role } from "../generated/prisma/client.js";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { authService } from "../services/auth.service.js";
import { AuthCookie } from "../utils/auth-cookie.js";
import { HttpError } from "../utils/http-error.js";
import { logFailure } from "../utils/log.js";

const unauthorized = (req: Request, message: string): HttpError =>
  logFailure(
    req,
    LogEvent.AuthUnauthorized,
    "Authentication failed",
    new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, message),
  );

export const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token: unknown = req.cookies?.[AuthCookie];
  if (typeof token !== "string") {
    throw unauthorized(req, "Authentication required");
  }

  const user = await authService.getUserFromToken(token);
  if (!user) {
    throw unauthorized(req, "Your session is invalid or has expired. Please log in again");
  }

  req.user = user;
  next();
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
    (req: Request, _res: Response, next: NextFunction): void => {
      if (!req.user) {
        throw unauthorized(req, "You must be logged in to access this resource");
      }

      if (!roles.includes(req.user.role)) {
        throw logFailure(
          req,
          LogEvent.AuthForbidden,
          "Access denied",
          new HttpError(HttpStatus.Forbidden, ErrorCode.Forbidden, "Your account does not have permission to access this resource"),
        );
      }

      next();
    };

export const requireAdmin: RequestHandler = requireRole("admin");
export const requireUser: RequestHandler = requireRole("user", "admin");
