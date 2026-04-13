const mongoose = require('mongoose');

const starSchema = new mongoose.Schema({
  name: { type: String },
  nameAr: { type: String, required: true },
  sport: { type: String, required: true },
  nationality: { type: String },
  nationalityAr: { type: String },
  nationalityFlag: { type: String, default: '' },
  club: { type: String },
  clubAr: { type: String },
  position: { type: String },
  age: { type: Number },
  image: { type: String, default: '' },
  bio: { type: String },
  bioAr: { type: String },
  customSections: {
    type: [{
      title: { type: String, default: '' },
      body: { type: String, default: '' },
      titleColor: { type: String, default: '#CC0000' },
      titleFontSize: { type: Number, default: 28 },
      titleFontFamily: { type: String, default: 'Cairo, sans-serif' },
    }],
    default: [],
  },
  stats: { type: Object, default: {} },
  featured: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' },
  videoUrls: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Star', starSchema);
