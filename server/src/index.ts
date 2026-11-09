import type { Server } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { errorMeta, flushLogger, logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";

const LogFlushTimeoutMs = 2_000;

let server: Server | undefined;
let shuttingDown = false;

const exit = async (code: number): Promise<never> => {
  await flushLogger(LogFlushTimeoutMs);
  process.exit(code);
};

const shutdown = async (reason: string, exitCode = 0): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`${reason}, shutting down`);

  try {
    if (server?.listening) {
      const closed = new Promise<void>((resolve) => server!.close(() => resolve()));
      server.closeAllConnections();
      await closed;
    }
    await prisma.$disconnect();
    logger.info("Shutdown complete");
  } catch (err) {
    exitCode = 1;
    logger.error("Error during shutdown", { error: errorMeta(err) });
  }

  await exit(exitCode);
};

const start = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    const reason = err instanceof Error ? err.message.trim().split("\n").pop() : String(err);
    logger.error("Cannot connect to database", { reason });
    await exit(1);
  }

  server = createApp().listen(env.port, (err?: NodeJS.ErrnoException): void => {
    if (err) {
      const message = err.code === "EADDRINUSE" ? `Port ${env.port} is already in use` : "Server failed to listen";
      logger.error(message, { error: errorMeta(err) });
      void exit(1);
      return;
    }

    logger.info(`Server listening on port ${env.port}`);
  });
};

for (const signal of ["SIGTERM", "SIGINT", "SIGUSR2"] as const) {
  process.once(signal, () => void shutdown(`${signal} received`));
}

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { error: errorMeta(reason) });
  void shutdown("Unhandled promise rejection", 1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { error: errorMeta(err) });
  void shutdown("Uncaught exception", 1);
});

void start();
