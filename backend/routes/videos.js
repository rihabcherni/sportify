const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { protect, adminOnly } = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const { storeUploadedFile } = require('../utils/mediaStorage');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category } = req.query;
    const query = {};
    if (category) query.category = category;
    const videos = await Video.find(query).populate('author', 'name').sort('-createdAt')
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await Video.countDocuments(query);
    res.json({ videos, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('author', 'name');
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json(video);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Increment views (separate endpoint to avoid double-count on GET in dev)
router.post('/:id/view', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('views');
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json({ views: video.views });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, uploadMedia.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (req.files?.thumbnail?.[0]) data.thumbnail = await storeUploadedFile(req, req.files.thumbnail[0], { folder: 'videos' });
    if (req.files?.video?.[0]) data.url = await storeUploadedFile(req, req.files.video[0], { folder: 'videos' });
    const video = await Video.create(data);
    res.status(201).json(video);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, uploadMedia.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.thumbnail?.[0]) data.thumbnail = await storeUploadedFile(req, req.files.thumbnail[0], { folder: 'videos' });
    if (req.files?.video?.[0]) data.url = await storeUploadedFile(req, req.files.video[0], { folder: 'videos' });
    const video = await Video.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(video);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
