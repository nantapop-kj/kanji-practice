const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const parseDummyHash = (value: string): string => {
  if (!/^\$2[aby]\$12\$[./A-Za-z0-9]{53}$/.test(value)) {
    throw new Error("DUMMY_PASSWORD_HASH must be a bcrypt hash with cost 12");
  }
  return value;
};

const isProd = process.env.APP_ENV === "prod" || process.env.NODE_ENV === "production";

const parseSameSite = (value?: string): "lax" | "strict" | "none" =>
  value === "strict" || value === "none" ? value : "lax";

export const env = {
  isProd,
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  dummyPasswordHash: parseDummyHash(required("DUMMY_PASSWORD_HASH")),
  cookieSameSite: parseSameSite(process.env.COOKIE_SAME_SITE),
  cookieSecure: process.env.COOKIE_SECURE === "true",
};
