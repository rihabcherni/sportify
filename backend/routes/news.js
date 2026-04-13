const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, adminOnly } = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const { storeUploadedFile } = require('../utils/mediaStorage');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured } = req.query;
    const query = {};
    if (category) query.category = category;
    if (featured) query.featured = true;
    const news = await News.find(query).populate('author', 'name').sort('-createdAt')
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await News.countDocuments(query);
    res.json({ news, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name');
    if (!news) return res.status(404).json({ message: 'Not found' });
    res.json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Increment views (separate endpoint to avoid double-count on GET in dev)
router.post('/:id/view', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('views');
    if (!news) return res.status(404).json({ message: 'Not found' });
    res.json({ views: news.views });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (req.files?.image?.[0]) data.image = await storeUploadedFile(req, req.files.image[0], { folder: 'news' });
    if (req.files?.video?.[0]) data.videoUrl = await storeUploadedFile(req, req.files.video[0], { folder: 'news' });
    const news = await News.create(data);
    res.status(201).json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.image?.[0]) data.image = await storeUploadedFile(req, req.files.image[0], { folder: 'news' });
    if (req.files?.video?.[0]) data.videoUrl = await storeUploadedFile(req, req.files.video[0], { folder: 'news' });
    const news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
