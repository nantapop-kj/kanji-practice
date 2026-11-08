import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { routes } from "./routes/index.js";

const app = express();

app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(env.port, (): void => {
  console.log(`server listening on port ${env.port}`);
});
