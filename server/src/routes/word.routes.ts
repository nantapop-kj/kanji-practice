import { Router } from "express";
import { wordController } from "../controllers/word.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

export const wordRoutes = Router();

wordRoutes.use(requireAuth);

wordRoutes.get("/levels", wordController.levels);

wordRoutes.use(requireAdmin);

wordRoutes.get("/", wordController.getAll);
wordRoutes.post("/", wordController.create);
wordRoutes.put("/:id", wordController.update);
wordRoutes.delete("/:id", wordController.remove);
