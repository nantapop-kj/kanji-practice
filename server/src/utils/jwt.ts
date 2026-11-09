import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const TokenTtlSeconds = 7 * 24 * 60 * 60;
 
const JwtAlgorithm = "HS256" as const;
 
const UuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 

if (Buffer.byteLength(env.jwtSecret, "utf8") < 32) {
  throw new Error("JWT secret must be at least 32 bytes long");
}
 
export const signToken = (userId: string): string =>
  jwt.sign({}, env.jwtSecret, {
    subject: userId,
    algorithm: JwtAlgorithm,
    expiresIn: TokenTtlSeconds,
  });
 
export const verifyToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, env.jwtSecret, {
      algorithms: [JwtAlgorithm]
    });
 
    const userId = typeof payload === "object" ? payload.sub : undefined;
 
    return userId && UuidRegex.test(userId) ? userId : null;
  } catch {
    return null;
  }
};