const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

// Public: submit feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, comment, rating, anonymous } = req.body;
    if (!comment || !rating) return res.status(400).json({ message: 'Comment and rating are required' });
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const data = {
      comment,
      rating: ratingNum,
      anonymous: !!anonymous
    };
    if (!anonymous) {
      if (name) data.name = name;
      if (email) data.email = email;
    }
    const created = await Feedback.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list feedbacks with pagination
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const pageNum = parseInt(req.query.page || 1, 10);
    const limitNum = parseInt(req.query.limit || 10, 10);
    const rows = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    const total = await Feedback.countDocuments();
    res.json({ feedbacks: rows, total, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete feedback
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
