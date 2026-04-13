const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String },
  titleAr: { type: String, required: true },
  content: { type: String },
  contentAr: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, enum: ['local', 'international', 'football', 'basketball', 'tennis', 'other'], default: 'football' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
