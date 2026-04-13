const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
