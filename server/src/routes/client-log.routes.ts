import { Router } from "express";
import { ClientLogRateLimit } from "../constants/rate-limit.js";
import { clientLogController } from "../controllers/client-log.controller.js";
import { attachUser } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";

export const clientLogRoutes = Router();

clientLogRoutes.post("/", rateLimit(ClientLogRateLimit), attachUser, clientLogController.create);
