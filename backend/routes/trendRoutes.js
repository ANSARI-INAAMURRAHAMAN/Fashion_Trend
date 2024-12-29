// routes/trendRoutes.js
const express = require('express');
const router = express.Router();
const  trendsController  = require('../controllers/trendsController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, trendsController.createTrend);
router.get('/', trendsController.getTrends);
router.get('/:id', trendsController.getTrendById);

module.exports = router;