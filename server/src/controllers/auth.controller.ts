import type { Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { authService } from "../services/auth.service.js";
import type { AuthRequest, BodyRequest, RegisterRequest, UserResponse } from "../types/auth.js";
import { clearAuthCookie, setAuthCookie } from "../utils/auth-cookie.js";
import { parseAuthRequest, parseRegisterRequest } from "../utils/auth-validation.js";
import { HttpError } from "../utils/http-error.js";

export const authController = {
  async register(req: BodyRequest<RegisterRequest>, res: Response<UserResponse>): Promise<void> {
    const { user, token } = await authService.register(parseRegisterRequest(req.body));
    setAuthCookie(res, token);

    res.status(HttpStatus.Created).json({ user });
  },

  async login(req: BodyRequest<AuthRequest>, res: Response<UserResponse>): Promise<void> {
    const { user, token } = await authService.login(parseAuthRequest(req.body));
    setAuthCookie(res, token);

    res.json({ user });
  },

  logout(_req: Request, res: Response): void {
    clearAuthCookie(res);

    res.status(HttpStatus.NoContent).end();
  },

  profile(req: Request, res: Response<UserResponse>): void {
    if (!req.user) {
      throw new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, "Authentication required");
    }

    res.json({ user: req.user });
  },
};
