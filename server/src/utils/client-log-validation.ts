import { ClientLogLevel, ClientLogLimits } from "../constants/client-log.js";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import type { ClientLogRequest } from "../types/client-log.js";
import { HttpError } from "./http-error.js";

const optionalText = (value: unknown, max: number): string | undefined => {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, max);
  return text || undefined;
};

export const parseClientLogRequest = (body: unknown): ClientLogRequest => {
  const data = (body ?? {}) as Record<string, unknown>;
  const message = optionalText(data.message, ClientLogLimits.message);

  if (!message) throw new HttpError(HttpStatus.BadRequest, ErrorCode.BadRequest, "Message is required");

  return {
    level: data.level === ClientLogLevel.Warn ? ClientLogLevel.Warn : ClientLogLevel.Error,
    message,
    stack: optionalText(data.stack, ClientLogLimits.stack),
    url: optionalText(data.url, ClientLogLimits.url),
    source: optionalText(data.source, ClientLogLimits.source),
  };
};
