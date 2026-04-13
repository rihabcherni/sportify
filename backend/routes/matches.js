const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect, adminOnly } = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const { storeUploadedFile } = require('../utils/mediaStorage');

router.get('/', async (req, res) => {
  try {
    const { date, status, page, limit } = req.query;
    const query = { type: 'match' };
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }

    if (page || limit) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit || 10, 10);
      const matches = await Match.find(query).sort('date')
        .limit(limitNum).skip((pageNum - 1) * limitNum);
      const total = await Match.countDocuments(query);
      return res.json({ matches, total, pages: Math.ceil(total / limitNum) });
    }

    const matches = await Match.find(query).sort('date');
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matches = await Match.find({ date: { $gte: today, $lt: tomorrow }, type: 'match' }).sort('date');
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Match.find({ type: 'announcement' }).sort('-createdAt').limit(10);
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Not found' });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, uploadMedia.fields([
  { name: 'homeTeamLogo', maxCount: 1 },
  { name: 'awayTeamLogo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'announcementImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files['homeTeamLogo']) data.homeTeamLogo = await storeUploadedFile(req, req.files['homeTeamLogo'][0], { folder: 'matches' });
    if (req.files['awayTeamLogo']) data.awayTeamLogo = await storeUploadedFile(req, req.files['awayTeamLogo'][0], { folder: 'matches' });
    if (req.files?.video?.[0]) data.videoUrl = await storeUploadedFile(req, req.files.video[0], { folder: 'matches' });
    if (req.files?.announcementImage?.[0]) data.announcementImage = await storeUploadedFile(req, req.files.announcementImage[0], { folder: 'matches' });
    
    if (data.homeScore === '') data.homeScore = null;
    if (data.awayScore === '') data.awayScore = null;
    if (data.date === '') data.date = null;

    const match = await Match.create(data);
    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, uploadMedia.fields([
  { name: 'homeTeamLogo', maxCount: 1 },
  { name: 'awayTeamLogo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'announcementImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files['homeTeamLogo']) data.homeTeamLogo = await storeUploadedFile(req, req.files['homeTeamLogo'][0], { folder: 'matches' });
    if (req.files['awayTeamLogo']) data.awayTeamLogo = await storeUploadedFile(req, req.files['awayTeamLogo'][0], { folder: 'matches' });
    if (req.files?.video?.[0]) data.videoUrl = await storeUploadedFile(req, req.files.video[0], { folder: 'matches' });
    if (req.files?.announcementImage?.[0]) data.announcementImage = await storeUploadedFile(req, req.files.announcementImage[0], { folder: 'matches' });
    if (data.date === '') data.date = null;

    const match = await Match.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
