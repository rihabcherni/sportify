const express = require('express');
const router = express.Router();
const Star = require('../models/Star');
const { protect, adminOnly } = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const { storeUploadedFile } = require('../utils/mediaStorage');

const normalizeStarPayload = (payload) => {
  const data = { ...payload };

  if (typeof data.customSections === 'string') {
    try {
      const parsed = JSON.parse(data.customSections);
      data.customSections = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      data.customSections = [];
    }
  }

  if (!Array.isArray(data.customSections)) {
    data.customSections = [];
  }

  data.customSections = data.customSections
    .map((section) => ({
      title: section?.title || '',
      body: section?.body || '',
      titleColor: section?.titleColor || '#CC0000',
      titleFontSize: Number(section?.titleFontSize) || 28,
      titleFontFamily: section?.titleFontFamily || 'Cairo, sans-serif',
    }))
    .filter((section) => section.title || section.body);

  if (typeof data.videoUrls === 'string') {
    try {
      const parsed = JSON.parse(data.videoUrls);
      data.videoUrls = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      data.videoUrls = data.videoUrls ? [data.videoUrls] : [];
    }
  }

  if (!Array.isArray(data.videoUrls)) {
    data.videoUrls = [];
  }

  data.videoUrls = data.videoUrls
    .map((url) => String(url || '').trim())
    .filter(Boolean);

  if (data.videoUrl && !data.videoUrls.length) {
    data.videoUrls = [String(data.videoUrl).trim()].filter(Boolean);
  }

  data.videoUrl = data.videoUrls[0] || '';

  return data;
};

router.get('/', async (req, res) => {
  try {
    const { sport, featured, page, limit } = req.query;
    const query = {};
    if (sport) query.sport = sport;
    if (featured) query.featured = true;

    if (page || limit) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit || 10, 10);
      const stars = await Star.find(query).sort('-createdAt')
        .limit(limitNum).skip((pageNum - 1) * limitNum);
      const total = await Star.countDocuments(query);
      return res.json({ stars, total, pages: Math.ceil(total / limitNum) });
    }

    const stars = await Star.find(query).sort('-createdAt');
    res.json(stars);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const star = await Star.findById(req.params.id);
    if (!star) return res.status(404).json({ message: 'Not found' });
    res.json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = normalizeStarPayload(req.body);
    if (req.files?.image?.[0]) data.image = await storeUploadedFile(req, req.files.image[0], { folder: 'stars' });
    if (req.files?.video?.[0]) {
      const uploadedVideo = await storeUploadedFile(req, req.files.video[0], { folder: 'stars' });
      data.videoUrls = [uploadedVideo, ...data.videoUrls.filter((url) => url !== uploadedVideo)];
      data.videoUrl = uploadedVideo;
    }
    const star = await Star.create(data);
    res.status(201).json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = normalizeStarPayload(req.body);
    if (req.files?.image?.[0]) data.image = await storeUploadedFile(req, req.files.image[0], { folder: 'stars' });
    if (req.files?.video?.[0]) {
      const uploadedVideo = await storeUploadedFile(req, req.files.video[0], { folder: 'stars' });
      data.videoUrls = [uploadedVideo, ...data.videoUrls.filter((url) => url !== uploadedVideo)];
      data.videoUrl = uploadedVideo;
    }
    const star = await Star.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(star);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Star.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
