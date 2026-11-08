import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

export const userRoutes = Router();

userRoutes.get("/", requireAuth, requireAdmin, userController.getAll);
