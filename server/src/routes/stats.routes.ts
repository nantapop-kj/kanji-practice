import { Router } from "express";
import { statsController } from "../controllers/stats.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const statsRoutes = Router();

statsRoutes.use(requireAuth);

statsRoutes.get("/", statsController.get);
statsRoutes.delete("/", statsController.reset);
