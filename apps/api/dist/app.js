import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import resourceRoutes from "./modules/resources/resources.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";
export function createApp() {
    const app = express();
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json({ limit: "2mb" }));
    app.use(cookieParser());
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/auth", authRoutes);
    app.use("/resources", resourceRoutes);
    app.use(notFound);
    app.use(errorHandler);
    return app;
}
