import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "./env.js";
import { logConfig, logger } from "./logger.js";

const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

const dbLog = logger.child({ component: "prisma" });

prisma.$on("warn", (e) => dbLog.warn(e.message));
prisma.$on("error", (e) => dbLog.error(e.message));

if (logConfig.dbQueries) {
  prisma.$on("query", (e) => dbLog.debug(`${e.query} ${Math.round(e.duration * 100) / 100}ms`));
}
