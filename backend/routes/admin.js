const express = require('express');
const router = express.Router();
const User = require('../models/User');
const News = require('../models/News');
const Match = require('../models/Match');
const Video = require('../models/Video');
const Star = require('../models/Star');
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [users, news, matches, videos, stars, articles] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Match.countDocuments(),
      Video.countDocuments(),
      Star.countDocuments(),
      Article.countDocuments()
    ]);
    res.json({ users, news, matches, videos, stars, articles });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/charts', protect, adminOnly, async (req, res) => {
  try {
    const [
      newsByCategory,
      matchesByStatus,
      videosByCategory,
      articlesByType,
      starsBySport,
      topNewsViews,
      newsByMonth,
      matchesByMonth,
      matchesByWeek,
      matchesByYear,
    ] = await Promise.all([
      News.aggregate([
        { $group: { _id: '$category', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      Match.aggregate([
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      Video.aggregate([
        { $group: { _id: '$category', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      Article.aggregate([
        { $group: { _id: '$type', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      Star.aggregate([
        { $group: { _id: '$sport', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      News.find().sort({ views: -1 }).limit(5).select('titleAr views'),
      News.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            value: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Match.aggregate([
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' } },
            value: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      (async () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday
        const diffToMonday = (day + 6) % 7;
        const start = new Date(now);
        start.setDate(now.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);

        return Match.aggregate([
          { $match: { date: { $gte: start, $lt: end } } },
          {
            $group: {
              _id: { $dayOfWeek: '$date' },
              value: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
      })(),
      Match.aggregate([
        {
          $group: {
            _id: { year: { $year: '$date' } },
            value: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1 } }
      ])
    ]);

    const normalize = (rows) => rows.map(r => ({ name: r._id || 'unknown', value: r.value }));

    res.json({
      newsByCategory: normalize(newsByCategory),
      matchesByStatus: normalize(matchesByStatus),
      videosByCategory: normalize(videosByCategory),
      articlesByType: normalize(articlesByType),
      starsBySport: normalize(starsBySport),
      topNewsViews: (topNewsViews || []).map(n => ({ name: n.titleAr || 'بدون عنوان', value: n.views || 0 })),
      newsByMonth: (newsByMonth || []).map(r => ({
        name: `${r._id.month}/${r._id.year}`,
        value: r.value
      })),
      matchesByMonth: (matchesByMonth || []).map(r => ({
        name: `${r._id.month}/${r._id.year}`,
        value: r.value
      })),
      matchesByWeek: (matchesByWeek || []).map(r => ({
        name: r._id,
        value: r.value
      })),
      matchesByYear: (matchesByYear || []).map(r => ({
        name: `${r._id.year}`,
        value: r.value
      })),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const users = await User.find().select('-password').sort('-createdAt')
      .limit(limitNum).skip((pageNum - 1) * limitNum);
    const total = await User.countDocuments();
    res.json({ users, total, pages: Math.ceil(total / limitNum) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
