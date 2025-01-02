// controllers/trendsController.js
const Trend = require('../models/trendModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel'); // Ensure User model is imported

// Define createTrend
const createTrend = asyncHandler(async (req, res) => {
  try {
    // Debug logs
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Create trend with validated data
    const trendData = {
      ...req.body,
      createdBy: req.user._id
    };

    const trend = await Trend.create(trendData);

    res.status(201).json({
      success: true,
      data: trend
    });
  } catch (error) {
    console.error('Create trend error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating trend',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Define getTrends
const getTrends = asyncHandler(async (req, res) => {
  try {
    const trends = await Trend.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');

    if (!trends || trends.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trends found'
      });
    }

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends',
      error: error.message
    });
  }
});

// Define getTrendById
const getTrendById = asyncHandler(async (req, res) => {
  const trend = await Trend.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('comments');

  if (!trend) {
    throw new ErrorResponse('Trend not found', 404);
  }

  res.status(200).json({ success: true, data: trend });
});

// Define updateTrend
const updateTrend = asyncHandler(async (req, res) => {
  let trend = await Trend.findById(req.params.id);

  if (!trend) {
    throw new ErrorResponse('Trend not found', 404);
  }

  if (trend.createdBy.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to update this trend', 401);
  }

  trend = await Trend.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: trend });
});

// Define deleteTrend
const deleteTrend = asyncHandler(async (req, res) => {
  const trend = await Trend.findById(req.params.id);

  if (!trend) {
    throw new ErrorResponse('Trend not found', 404);
  }

  if (trend.createdBy.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to delete this trend', 401);
  }

  await trend.remove();

  res.status(200).json({ success: true, data: {} });
});

// Define shareTrend
const shareTrend = asyncHandler(async (req, res) => {
  try {
    const { trendId, userEmails, role } = req.body;
    const trend = await Trend.findById(trendId);

    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }

    // Check if requester is the owner
    if (trend.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find users by emails
    const users = await User.find({ email: { $in: userEmails } });

    // Add collaborators
    users.forEach(user => {
      if (!trend.collaborators.find(c => c.user.toString() === user._id.toString())) {
        trend.collaborators.push({ user: user._id, role });
      }
    });

    await trend.save();
    res.json({ message: 'Trend shared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define addComment
const addComment = asyncHandler(async (req, res) => {
  try {
    const { trendId, content } = req.body;
    const trend = await Trend.findById(trendId);

    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }

    // Check if user has access
    const hasAccess = trend.createdBy.toString() === req.user._id.toString() ||
      trend.collaborators.some(c => c.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    trend.comments.push({
      user: req.user._id,
      content
    });

    await trend.save();
    res.json(trend.comments[trend.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define getTrendAnalytics
const getTrendAnalytics = asyncHandler(async (req, res) => {
  try {
    const trend = await Trend.findById(req.params.id);
    
    if (!trend) {
      return res.status(404).json({
        success: false,
        message: 'Trend not found'
      });
    }

    // Example analytics data
    const analytics = {
      views: trend.views || 0,
      comments: trend.comments.length,
      // Add more analytics metrics as needed
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching trend analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trend analytics',
      error: error.message
    });
  }
});

// Export all controllers
module.exports = {
  getTrends,
  createTrend,
  getTrendById,
  updateTrend,
  deleteTrend,
  shareTrend,
  addComment,
  getTrendAnalytics // Add this line
};