const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// En serverless (Vercel), seul /tmp est inscriptible.
// Si Blob est configuré, on garde les fichiers en mémoire pour les envoyer à Blob.
let storage;
if (hasBlobToken) {
  storage = multer.memoryStorage();
} else {
  const uploadsDir = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : fs.existsSync(os.tmpdir())
      ? path.join(os.tmpdir(), 'uploads')
      : path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/;
  const videoTypes = /mp4|webm|ogg|mov|m4v/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = imageTypes.test(ext) && imageTypes.test(file.mimetype);
  const isVideo = videoTypes.test(ext) && videoTypes.test(file.mimetype);

  if (isImage || isVideo) {
    return cb(null, true);
  }
  cb(new Error('Images or videos only! (jpeg, jpg, png, webp, mp4, webm, ogg, mov, m4v)'));
};

const uploadMedia = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter
});

module.exports = uploadMedia;
