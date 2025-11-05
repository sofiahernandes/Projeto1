import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('src', 'uploads'); // pasta absoluta dentro de src/uploads
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const allowed = new Set(['image/png', 'image/jpeg', 'image/jpg']);
const fileFilter = (req, file, cb) => {
  if (!allowed.has(file.mimetype)) return cb(new Error('Arquivo Inválido'));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB para teste
});

export default upload;