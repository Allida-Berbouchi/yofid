import * as S from "./resources.service.js";
import { canApprove, canCreateResource, canInvite } from "./resources.policy.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { signInviteToken, verifyInviteToken } from "../../utils/jwt.js";
import { env } from "../../config/env.js";
export const list = asyncHandler(async (req, res) => {
    const items = await S.list(req.query);
    res.json({ items });
});
export const getOne = asyncHandler(async (req, res) => {
    const item = await S.getById(req.params.id);
    res.json({ item });
});
export const create = asyncHandler(async (req, res) => {
    if (!req.user) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }
    if (!canCreateResource(req.user.role)) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
    }
    const item = await S.create(req.body, req.user.id);
    res.status(201).json({ item });
});
export const invite = asyncHandler(async (req, res) => {
    if (!req.user) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }
    if (!canInvite(req.user.role)) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
    }
    const { email, name } = req.body;
    const token = signInviteToken({ email, name, purpose: "resource_invite" });
    const link = `${env.WEB_URL}/submit?token=${encodeURIComponent(token)}`;
    res.json({
        token,
        link,
        email: {
            to: email,
            subject: "You are invited to add a learning resource",
            text: `Hi${name ? ` ${name}` : ""},\n\n` +
                "You have been invited to add a learning resource. Use the link below:\n" +
                `${link}\n\n` +
                "If you did not expect this, you can ignore this email.",
            html: `<p>Hi${name ? ` ${name}` : ""},</p>` +
                "<p>You have been invited to add a learning resource. Use the link below:</p>" +
                `<p><a href="${link}">Add a resource</a></p>` +
                "<p>If you did not expect this, you can ignore this email.</p>"
        }
    });
});
export const submit = asyncHandler(async (req, res) => {
    const { inviteToken, ...input } = req.body;
    const payload = verifyInviteToken(inviteToken);
    if (payload.purpose !== "resource_invite") {
        const err = new Error("Invalid invite token");
        err.statusCode = 401;
        throw err;
    }
    const createdBy = `invite:${payload.email}`;
    const item = await S.create(input, createdBy);
    res.status(201).json({ item });
});
export const approve = asyncHandler(async (req, res) => {
    if (!req.user) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }
    if (!canApprove(req.user.role)) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
    }
    const item = await S.approve(req.params.id);
    res.json({ item });
});
