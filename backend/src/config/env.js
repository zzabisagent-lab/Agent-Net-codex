const path = require("path");

const dotenv = require("dotenv");

const repoRoot = path.resolve(__dirname, "../../..");
const rootEnvPath = path.join(repoRoot, ".env");

dotenv.config({ path: rootEnvPath });

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function parseInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
}

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "/api/v1";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "") || "/api/v1";
}

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const env = Object.freeze({
  nodeEnv,
  isProduction,
  port: parseInteger(process.env.PORT, 5000),
  apiBasePath: normalizeBasePath(process.env.API_BASE_PATH || "/api/v1"),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/agentagora",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "replace_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtCookieName: process.env.JWT_COOKIE_NAME || "agora_access",
  csrfCookieName: process.env.CSRF_COOKIE_NAME || "agora_csrf",
  bcryptSaltRounds: parseInteger(process.env.BCRYPT_SALT_ROUNDS, 12),
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: parseInteger(process.env.SMTP_PORT, 1025),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "AgentAgora <noreply@example.com>",
  },
  adminBootstrapEnabled: isProduction
    ? false
    : parseBoolean(process.env.ADMIN_BOOTSTRAP_ENABLED, true),
  adminEmail: process.env.ADMIN_EMAIL || "admin@agentagora.local",
  adminPassword: process.env.ADMIN_PASSWORD || "change_me_local_only",
  invitationExpiresDays: parseInteger(process.env.INVITATION_EXPIRES_DAYS, 7),
  agentApiKeyPrefix: process.env.AGENT_API_KEY_PREFIX || "agora_",
  logLevel: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  rateLimitMode: process.env.RATE_LIMIT_MODE || "memory",
  trustProxy: parseBoolean(process.env.TRUST_PROXY, false),
  cookieSecure: parseBoolean(process.env.COOKIE_SECURE, isProduction),
  cookieSameSite: process.env.COOKIE_SAME_SITE || "lax",
  enableRequestLog: parseBoolean(process.env.ENABLE_REQUEST_LOG, false),
  defaultSubmoltList:
    process.env.DEFAULT_SUBMOLT_LIST ||
    "general,introductions,announcements,todayilearned,ponderings,codinghelp",
  repoRoot,
});

module.exports = env;
