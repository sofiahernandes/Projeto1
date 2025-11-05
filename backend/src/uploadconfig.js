import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isDev = process.env.NODE_ENV !== "production";

const storage = isDev
  ? (() => {
      const uploadDir = path.resolve("src", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      return multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
          cb(null, name);
        },
      });
    })()
  : new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "comprovantes",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [
          {
            width: 1200,
            quality: "auto",
            fetch_format: "auto",
          },
        ],

        public_id: (req, file) => {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1e9);
          const ext = path.extname(file.originalname).toLowerCase();
          return `${timestamp}-${random}`;
        },
      },
    });

const allowed = new Set(["image/png", "image/jpeg", "image/jpg"]);
const fileFilter = (req, file, cb) => {
  if (!allowed.has(file.mimetype)) {
    return cb(new Error("Apenas arquivos PNG, JPG e JPEG são permitidos"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
