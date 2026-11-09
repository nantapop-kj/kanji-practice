export const RateLimitCleanupIntervalMs = 60_000;

export const AuthRateLimit = { name: "auth", windowMs: 15 * 60_000, max: 20 } as const;
export const ClientLogRateLimit = { name: "client-log", windowMs: 60_000, max: 30 } as const;

export const TrustedProxies = "loopback, linklocal, uniquelocal";
