import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const quizRoutes = Router();

quizRoutes.use(requireAuth);

quizRoutes.get("/next", quizController.next);
quizRoutes.post("/answer", quizController.answer);
quizRoutes.post("/override", quizController.override);
