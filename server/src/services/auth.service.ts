import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { userRepository } from "../repositories/user.repository.js";
import type { AuthRequest, AuthResult, AuthUser, RegisterRequest } from "../types/auth.js";
import { PasswordMaxLength } from "../utils/auth-validation.js";
import { HttpError } from "../utils/http-error.js";
import { signToken, verifyToken } from "../utils/jwt.js";

const BcryptCost = 12;

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === "object" && err !== null && "code" in err && err.code === "P2002";

export const authService = {
  async register({ email, password, name }: RegisterRequest): Promise<AuthResult> {
    if (await userRepository.getByEmail(email)) {
      throw new HttpError(HttpStatus.Conflict, ErrorCode.EmailTaken, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, BcryptCost);

    try {
      const user = await userRepository.create({ email, passwordHash, name });

      return { user: user, token: signToken(user.id) };
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new HttpError(HttpStatus.Conflict, ErrorCode.EmailTaken, "Email is already registered");
      }

      throw err;
    }
  },

  async login({ email, password }: AuthRequest): Promise<AuthResult> {
    const user = await userRepository.getByEmail(email);
    const matches = await bcrypt.compare(password, user?.passwordHash ?? env.dummyPasswordHash);

    if (!user || !matches || password.length > PasswordMaxLength) {
      throw new HttpError(HttpStatus.Unauthorized, ErrorCode.InvalidCredentials, "Email or password is incorrect");
    }

    return { user: user, token: signToken(user.id) };
  },

  async getUserFromToken(token: string): Promise<AuthUser | null> {
    const userId = verifyToken(token);
    if (!userId) return null;

    const user = await userRepository.getById(userId);

    return user;
  },
};
