import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authRequired } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validate.js";
import { createResourceInviteSchema, createResourceSchema, submitResourceSchema } from "@yovid/shared";
import * as C from "./resources.controller.js";
import * as ContentC from "./content-request.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as S from "./resources.service.js";
import { verifyInviteToken } from "../../utils/jwt.js";
const r = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRootDir = path.join(__dirname, "../../../uploads");
const uploadDirByFolder = {
    videos: path.join(uploadRootDir, "videos"),
    images: path.join(uploadRootDir, "images"),
    files: path.join(uploadRootDir, "files")
};
for (const dir of Object.values(uploadDirByFolder)) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function toSafeFileNamePart(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
function resolveFileTarget(file) {
    if (file.mimetype.startsWith("video/")) {
        return { folder: "videos", type: "video" };
    }
    if (file.mimetype.startsWith("image/")) {
        return { folder: "images", type: "image" };
    }
    if (file.mimetype === "application/pdf") {
        return { folder: "files", type: "pdf" };
    }
    const err = new Error("Invalid file type. Only image, video, and PDF files are allowed.");
    err.statusCode = 400;
    throw err;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const target = resolveFileTarget(file);
            cb(null, uploadDirByFolder[target.folder]);
        }
        catch (error) {
            cb(error, "");
        }
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name || "file";
        const safeName = toSafeFileNamePart(originalName) || "file";
        const ext = path.extname(file.originalname) || ".bin";
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${safeName}-${suffix}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
            "video/x-msvideo",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf"
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only image, video, and PDF files are allowed."));
        }
    },
});
async function uploadResourceFile(req, actor) {
    if (!req.file) {
        const err = new Error("No file uploaded");
        err.statusCode = 400;
        throw err;
    }
    const { title, description, moduleId } = req.body;
    const target = resolveFileTarget(req.file);
    const sourceUrl = `/api/uploads/${target.folder}/${req.file.filename}`;
    const fileKey = `${target.folder}/${req.file.filename}`;
    const item = await S.create({
        type: target.type,
        title: title || req.file.originalname,
        description: description || "",
        moduleId: moduleId || "general",
        sourceUrl,
        fileKey
    }, actor.createdBy);
    return {
        item,
        fileKey,
        fileUrl: sourceUrl
    };
}
async function handleInviteResourceFileUpload(req, res) {
    const { inviteToken } = req.body;
    if (!inviteToken) {
        const err = new Error("Missing invite token");
        err.statusCode = 400;
        throw err;
    }
    const payload = verifyInviteToken(inviteToken);
    if (payload.purpose !== "resource_invite") {
        const err = new Error("Invalid invite token");
        err.statusCode = 401;
        throw err;
    }
    const result = await uploadResourceFile(req, {
        createdBy: `invite:${payload.email}`
    });
    res.status(201).json(result);
}
async function handleAuthedResourceFileUpload(req, res) {
    if (!req.user) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }
    const result = await uploadResourceFile(req, {
        createdBy: req.user.id
    });
    res.status(201).json(result);
}
// Content request endpoints
r.post("/request-contributor", ContentC.requestContributor);
r.post("/verify-contributor", ContentC.verifyContributor);
r.get("/check-contributor", ContentC.checkContributorStatus);
// Resource endpoints
r.get("/", C.list);
r.post("/invite", authRequired, validateBody(createResourceInviteSchema), C.invite);
r.post("/submit", validateBody(submitResourceSchema), C.submit);
r.post("/upload-file", upload.single("file"), asyncHandler(handleInviteResourceFileUpload));
// Backward-compatible alias used by current frontend.
r.post("/upload-video", upload.single("file"), asyncHandler(handleInviteResourceFileUpload));
r.post("/upload-file-auth", authRequired, upload.single("file"), asyncHandler(handleAuthedResourceFileUpload));
r.post("/", authRequired, validateBody(createResourceSchema), C.create);
r.post("/:id/approve", authRequired, C.approve);
r.get("/:id", C.getOne);
export default r;
