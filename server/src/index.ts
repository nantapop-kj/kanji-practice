import cors from "cors";
import express from "express";

const port = Number(process.env.PORT ?? 3001);
const corsOrigins = (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean);

const app = express();

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
