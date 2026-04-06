import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import resourceRoutes from "./modules/resources/resources.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function createApp() {
    const app = express();
    // CORS Configuration - Allow credentials
    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ limit: "2mb", extended: true }));
    app.use(cookieParser());
    // Serve locally uploaded files for testing
    app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));
    // Backward-compatible alias for old video URLs.
    app.use("/api/videos", express.static(path.join(__dirname, "../uploads/videos")));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/auth", authRoutes);
    app.use("/resources", resourceRoutes);
    app.use(notFound);
    app.use(errorHandler);
    return app;
}
