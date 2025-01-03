const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    createComment, 
    getTaskComments, 
    getTrendComments 
} = require('../controllers/commentController');

router.post('/', protect, createComment);
router.get('/task/:taskId', protect, getTaskComments);
router.get('/trend/:trendId', protect, getTrendComments);

module.exports = router;