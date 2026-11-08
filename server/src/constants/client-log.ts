export enum ClientLogLevel {
  Error = "error",
  Warn = "warn",
}

export const ClientLogLimits = {
  message: 2000,
  stack: 8000,
  url: 500,
  source: 50,
} as const;
