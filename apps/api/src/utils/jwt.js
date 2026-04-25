import "../loadEnv.js";

export const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_ACCESS_SECRET or JWT_SECRET must be set in the root .env file");
}
