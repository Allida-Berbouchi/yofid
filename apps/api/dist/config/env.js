import dotenv from "dotenv";
dotenv.config();
function req(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env var: ${name}`);
    return v;
}
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 4000),
    MONGO_URI: req("MONGO_URI"),
    JWT_ACCESS_SECRET: req("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: req("JWT_REFRESH_SECRET"),
    JWT_INVITE_SECRET: req("JWT_INVITE_SECRET"),
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? "30d",
    INVITE_TOKEN_TTL: process.env.INVITE_TOKEN_TTL ?? "7d",
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    WEB_URL: process.env.WEB_URL ?? "http://localhost:3000"
};
