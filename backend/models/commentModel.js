// models/commentModel.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  trendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trend'
  },
  user: {  // Changed from 'author' to 'user' for consistency
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validate that either taskId or trendId is present
commentSchema.pre('save', function(next) {
  if (!this.taskId && !this.trendId) {
    next(new Error('Comment must be associated with either a Task or a Trend'));
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);