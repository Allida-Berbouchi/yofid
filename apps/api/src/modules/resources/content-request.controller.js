import { asyncHandler } from "../../utils/asyncHandler.js";
import * as contentRequestService from "./content-request.service.js";
export const requestContributor = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
        const err = new Error("Email is required");
        err.statusCode = 400;
        throw err;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const err = new Error("Invalid email format");
        err.statusCode = 400;
        throw err;
    }
    const { code } = await contentRequestService.createContentRequest(email);
    const emailContent = contentRequestService.formatVerificationEmail(email, code);
    res.json({
        success: true,
        message: "Verification code generated. Use the code below.",
        demo: {
            code,
            emailContent
        }
    });
});
export const verifyContributor = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        const err = new Error("Email and code are required");
        err.statusCode = 400;
        throw err;
    }
    const isValid = await contentRequestService.verifyCode(email, code);
    if (!isValid) {
        const err = new Error("Invalid or expired verification code");
        err.statusCode = 401;
        throw err;
    }
    res.json({
        success: true,
        message: "Email verified. You can now add content.",
        email
    });
});
export const checkContributorStatus = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        const err = new Error("Email is required");
        err.statusCode = 400;
        throw err;
    }
    const isVerified = await contentRequestService.isUserVerified(email);
    res.json({
        email,
        isVerified
    });
});
