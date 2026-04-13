const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String },
  titleAr: { type: String, required: true },
  content: { type: String },
  contentAr: { type: String, required: true },
  image: { type: String, default: '' },
  type: { type: String, enum: ['analysis', 'opinion', 'report'], default: 'analysis' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  videoUrl: { type: String, default: '' },
  videoUrls: { type: [String], default: [] },
  customSections: {
    type: [{
      title: { type: String, default: '' },
      body: { type: String, default: '' },
      titleColor: { type: String, default: '#CC0000' },
      titleFontSize: { type: Number, default: 28 },
      titleFontFamily: { type: String, default: 'Arial, sans-serif' },
    }],
    default: [],
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
