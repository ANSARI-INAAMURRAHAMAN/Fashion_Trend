// routes/trendRoutes.js
const express = require('express');
const router = express.Router();
const Trend = require('../models/trendModel');
const Comment = require('../models/commentModel');
const { protect } = require('../middlewares/authMiddleware');  // Updated path
const { validateTrendInput } = require('../middlewares/validationMiddleware');
const { 
    getTrends,
    createTrend,
    updateTrend,
    deleteTrend,
    shareTrend,
    addComment,
    getTrendAnalytics
} = require('../controllers/trendsController');

// Get all trends
router.get('/', getTrends);

// Get shared trends
router.get('/shared', protect, async (req, res) => {
  try {
    const trends = await Trend.find({ isShared: true })
      .populate('createdBy', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', protect, validateTrendInput, createTrend);
router.post('/share', protect, shareTrend);
router.post('/comment', protect, async (req, res) => {
  try {
    const { trendId, content } = req.body;
    
    // Create new comment
    const comment = await Comment.create({
      content,
      user: req.user._id,
      trend: trendId
    });

    // Populate user details
    await comment.populate('user', 'username');

    // Add comment to trend
    await Trend.findByIdAndUpdate(
      trendId,
      { $push: { comments: comment._id } }
    );

    res.status(201).json({
      _id: comment._id,
      content: comment.content,
      user: {
        _id: req.user._id,
        username: req.user.username
      },
      createdAt: comment.createdAt
    });

  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ 
      message: 'Failed to add comment',
      error: error.message 
    });
  }
});
router.post('/:id/comments', protect, addComment);
router.route('/:id')
    .put(protect, validateTrendInput, updateTrend)
    .delete(protect, deleteTrend);

router.get('/:id/analytics', protect, getTrendAnalytics);

module.exports = router;