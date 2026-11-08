import type { Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { authService } from "../services/auth.service.js";
import type { AuthRequest, BodyRequest, RegisterRequest, UserResponse } from "../types/auth.js";
import { clearAuthCookie, setAuthCookie } from "../utils/auth-cookie.js";
import { parseAuthRequest, parseRegisterRequest } from "../utils/auth-validation.js";
import { HttpError } from "../utils/http-error.js";
import { logFailure } from "../utils/log.js";

export const authController = {
  async register(req: BodyRequest<RegisterRequest>, res: Response<UserResponse>): Promise<void> {
    try {
      const { user, token } = await authService.register(parseRegisterRequest(req.body));
      setAuthCookie(res, token);
      req.log.info("User registered", { event: LogEvent.AuthRegister, userId: user.id });

      res.status(HttpStatus.Created).json({ user });
    } catch (err) {
      throw logFailure(req, LogEvent.AuthRegisterFailed, "Register failed", err);
    }
  },

  async login(req: BodyRequest<AuthRequest>, res: Response<UserResponse>): Promise<void> {
    try {
      const { user, token } = await authService.login(parseAuthRequest(req.body));
      setAuthCookie(res, token);
      req.log.info("Login succeeded", { event: LogEvent.AuthLogin, userId: user.id });

      res.json({ user });
    } catch (err) {
      throw logFailure(req, LogEvent.AuthLoginFailed, "Login failed", err);
    }
  },

  logout(_: Request, res: Response): void {
    clearAuthCookie(res);

    res.status(HttpStatus.NoContent).end();
  },

  profile(req: Request, res: Response<UserResponse>): void {
    if (!req.user) {
      throw logFailure(
        req,
        LogEvent.AuthProfileFailed,
        "Get profile failed",
        new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, "Authentication required"),
      );
    }

    res.json({ user: req.user });
  },
};
