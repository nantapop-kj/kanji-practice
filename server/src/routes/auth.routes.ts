import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { AuthRateLimit } from "../constants/rate-limit.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";

export const authRoutes = Router();

const authLimit = rateLimit(AuthRateLimit);

authRoutes.post("/register", authLimit, authController.register);
authRoutes.post("/login", authLimit, authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/profile", requireAuth, authController.profile);
