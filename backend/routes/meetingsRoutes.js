const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Meeting = require('../models/meetingModel');

// Create meeting
router.post('/', protect, async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      createdBy: req.user._id
    });
    await meeting.save();
    await meeting.populate('attendees', 'username avatar');
    
    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get team meetings
router.get('/team/:teamId', protect, async (req, res) => {
  try {
    const meetings = await Meeting.find({ teamId: req.params.teamId })
      .populate('attendees', 'username avatar')
      .populate('createdBy', 'username')
      .sort({ date: 1 });
    
    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
