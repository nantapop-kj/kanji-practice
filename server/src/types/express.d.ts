import type { Logger } from "../config/logger.js";
import type { AuthUser } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      id: string;
      log: Logger;
      user?: AuthUser;
    }
  }
}
