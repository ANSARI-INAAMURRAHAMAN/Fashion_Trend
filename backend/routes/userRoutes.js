//routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/refresh-counts', protect, userController.refreshCounts);

module.exports = router;