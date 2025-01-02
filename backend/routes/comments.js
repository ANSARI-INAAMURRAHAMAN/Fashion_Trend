// routes/comments.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addComment, getTaskComments } = require('../controllers/commentController');

// Make sure the controller functions exist before adding the routes
router.post('/', protect, addComment);
router.get('/task/:taskId', protect, getTaskComments);

module.exports = router;