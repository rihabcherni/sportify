const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  type: { type: String, enum: ['match', 'announcement'], default: 'match' },
  title: { type: String, default: '' },
  announcementImage: { type: String, default: '' },
  homeTeam: { type: String, default: '' },
  awayTeam: { type: String, default: '' },
  homeTeamLogo: { type: String, default: '' },
  awayTeamLogo: { type: String, default: '' },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  date: { type: Date, default: null },
  competition: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
  venue: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
