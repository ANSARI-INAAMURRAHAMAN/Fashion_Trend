// models/trendModel.js
const mongoose = require('mongoose');
const trendSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
  },
  metrics: {
      popularity: Number,
      growth: Number,
      engagement: Number
  },
  tags: [String],
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
}, {
  timestamps: true
});

const Trend = mongoose.model('Trend', trendSchema);