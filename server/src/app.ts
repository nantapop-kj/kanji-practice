import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { env } from "./config/env.js";
import { ErrorCode, HttpStatus } from "./constants/http.js";
import { TrustedProxies } from "./constants/rate-limit.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { routes } from "./routes/index.js";

const JsonBodyLimit = "100kb";

export const createApp = (): express.Express => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", TrustedProxies);

  app.use(requestLogger);
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: JsonBodyLimit }));
  app.use(cookieParser());

  app.use("/api/v1", routes);

  app.use((_req: Request, res: Response): void => {
    res.status(HttpStatus.NotFound).json({ error: { code: ErrorCode.NotFound, message: "Route not found" } });
  });

  app.use(errorHandler);

  return app;
};
