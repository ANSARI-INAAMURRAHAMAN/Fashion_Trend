//routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;