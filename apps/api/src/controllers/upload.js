import multer from "multer";
import fs from "fs";
import path from "path";

const uploadRoot = path.join("C:", "Youfid_Data");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    cb(null, `${Date.now()}-${safeBase}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf";

  if (allowed) return cb(null, true);
  cb(new Error("Only video, image, and PDF files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 20,
    fileSize: 500 * 1024 * 1024, // 500 MB per file
  },
});

export { uploadRoot };
export default upload;