import path from "node:path";
import winston from "winston";
import {
  LogDbQueries,
  LogDir,
  LogFile,
  LogFormat,
  LogLevel,
  LogMaxFiles,
  LogMaxFileSize,
} from "../constants/log.js";
import { env } from "./env.js";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const SensitiveKeys = new Set([
  "password",
  "passwordhash",
  "token",
  "authorization",
  "cookie",
  "jwt",
  "secret",
]);
const MaxRedactDepth = 5;

export const logConfig = {
  level: env.isProd ? LogLevel.Http : LogLevel.Debug,
  format: env.isProd ? LogFormat.Json : LogFormat.Pretty,
  dir: LogDir,
  dbQueries: LogDbQueries,
} as const;

const redactObject = (value: unknown, depth: number, seen: WeakSet<object>): unknown => {
  if (!value || typeof value !== "object" || depth > MaxRedactDepth || seen.has(value)) return value;
  seen.add(value);

  if (Array.isArray(value)) return value.map((v) => redactObject(v, depth + 1, seen));

  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value)) {
    out[key] = SensitiveKeys.has(key.toLowerCase()) ? "[REDACTED]" : redactObject(v, depth + 1, seen);
  }
  return out;
};

const redact = winston.format((info) => {
  const seen = new WeakSet<object>();
  for (const key of Object.keys(info)) {
    info[key] = SensitiveKeys.has(key.toLowerCase()) ? "[REDACTED]" : redactObject(info[key], 0, seen);
  }
  return info;
});

const prettyLine = printf(({ timestamp: ts, level, message, requestId, stack, ...meta }) => {
  const rid = requestId ? ` [${String(requestId).slice(0, 8)}]` : "";
  const defined = Object.fromEntries(Object.entries(meta).filter(([, v]) => v !== undefined));
  const rest = Object.keys(defined).length ? ` ${JSON.stringify(defined)}` : "";
  return `${ts} ${level}${rid} ${message}${rest}${stack ? `\n${stack}` : ""}`;
});

const jsonFormat = combine(errors({ stack: true }), redact(), timestamp(), json());
const prettyFormat = combine(
  errors({ stack: true }),
  redact(),
  timestamp({ format: "HH:mm:ss.SSS" }),
  colorize(),
  prettyLine,
);

const fileTransport = (filename: LogFile, level?: LogLevel): winston.transport =>
  new winston.transports.File({
    filename: path.join(logConfig.dir, filename),
    level,
    format: jsonFormat,
    maxsize: LogMaxFileSize,
    maxFiles: LogMaxFiles,
    tailable: true,
  });

const transports: winston.transport[] = [
  new winston.transports.Console({ format: logConfig.format === LogFormat.Json ? jsonFormat : prettyFormat }),
  fileTransport(LogFile.Combined),
  fileTransport(LogFile.Error, LogLevel.Error),
];

export const logger = winston.createLogger({
  level: logConfig.level,
  transports,
  exitOnError: false,
});

export type Logger = winston.Logger;

export const errorMeta = (err: unknown): string =>
  err instanceof Error ? (err.stack ?? err.message) : String(err);

export const flushLogger = (timeoutMs: number): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    const done = logger.transports.map(
      (transport) => new Promise<void>((r) => transport.once("finish", () => r())),
    );

    Promise.all(done).then(() => {
      clearTimeout(timer);
      resolve();
    });
    logger.end();
  });
