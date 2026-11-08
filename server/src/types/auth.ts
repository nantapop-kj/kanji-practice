import type { Request } from "express";
import type { Role, User } from "../generated/prisma/client.js";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type PublicUser = Omit<User, "passwordHash">;

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};

export type UserResponse = {
  user: AuthUser;
};

export type BodyRequest<TBody> = Request<Record<string, string>, unknown, TBody>;
