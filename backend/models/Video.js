const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String },
  titleAr: { type: String, required: true },
  description: { type: String },
  descriptionAr: { type: String },
  url: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  views: { type: Number, default: 0 },
  category: { type: String, enum: ['highlights', 'interviews', 'analysis', 'other'], default: 'highlights' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
