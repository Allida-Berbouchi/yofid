import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
let isConfigured = false;
export function configureCloudinary() {
    if (isConfigured)
        return;
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
        return;
    }
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });
    isConfigured = true;
}
export function assertCloudinaryConfigured() {
    configureCloudinary();
    if (!isConfigured) {
        const err = new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
        err.statusCode = 500;
        throw err;
    }
}
export { cloudinary };
