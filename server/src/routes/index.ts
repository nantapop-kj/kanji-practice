import { Router, type Request, type Response } from "express";
import { authRoutes } from "./auth.routes.js";
import { quizRoutes } from "./quiz.routes.js";
import { userRoutes } from "./user.routes.js";
import { wordRoutes } from "./word.routes.js";

export const routes = Router();

routes.get("/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

routes.use("/auth", authRoutes);
routes.use("/quiz", quizRoutes);
routes.use("/users", userRoutes);
routes.use("/words", wordRoutes);
