import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

const BASE_UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Buat direktori utama dan subfolder
const IMAGE_DIR = path.join(BASE_UPLOAD_DIR, "images");
const DOCS_DIR = path.join(BASE_UPLOAD_DIR, "docs");

fs.ensureDirSync(IMAGE_DIR);
fs.ensureDirSync(DOCS_DIR);

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    const mimeType = file.mimetype;

    if (mimeType.startsWith("image/")) {
      cb(null, IMAGE_DIR);
    } else if (mimeType === "application/pdf") {
      cb(null, DOCS_DIR);
    } else {
      // Jika tipe file tidak dikenali, beri error
      cb(new Error("Tipe file tidak diizinkan"), null);
    }
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeName = baseName.replace(/[^a-zA-Z0-9_.-]/g, "");

    cb(null, `${safeName}-${uuidv4()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      const error = new Error("Tipe file tidak diizinkan");
      error.statusCode = 400;
      return cb(error, false); // to trigger catch in controller
    }
    cb(null, true);
  },
});
