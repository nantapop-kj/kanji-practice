import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";
import { TokenTtlSeconds } from "./jwt.js";

export const AuthCookie = "kanji_practice_token";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  path: "/",
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AuthCookie, token, {
    ...cookieOptions,
    maxAge: TokenTtlSeconds * 1000,
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AuthCookie, cookieOptions);
};
