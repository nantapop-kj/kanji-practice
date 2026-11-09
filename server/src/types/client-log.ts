import type { ClientLogLevel } from "../constants/client-log.js";

export type ClientLogRequest = {
  level: ClientLogLevel;
  message: string;
  stack?: string;
  url?: string;
  source?: string;
};
