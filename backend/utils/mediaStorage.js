const path = require('path');
const { put } = require('@vercel/blob');
const { buildMediaUrl } = require('./mediaUrl');

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const sanitizeName = (name) => {
  const base = path.basename(name || 'file');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const storeUploadedFile = async (req, file, options = {}) => {
  if (!file) return '';

  if (hasBlobToken() && file.buffer) {
    const folder = options.folder || 'uploads';
    const safeName = sanitizeName(file.originalname);
    const blob = await put(`${folder}/${safeName}`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.mimetype
    });
    return blob.url;
  }

  if (file.filename) {
    return buildMediaUrl(req, file.filename);
  }

  return '';
};

module.exports = { storeUploadedFile };
