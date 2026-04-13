const buildBaseUrl = (req) => {
  const envBase = process.env.API_BASE_URL;
  const base = envBase && envBase.trim().length > 0
    ? envBase.trim()
    : `${req.protocol}://${req.get('host')}`;
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const buildMediaUrl = (req, filename) => {
  if (!filename) return '';
  const base = buildBaseUrl(req);
  return `${base}/uploads/${filename}`;
};

module.exports = { buildMediaUrl };
