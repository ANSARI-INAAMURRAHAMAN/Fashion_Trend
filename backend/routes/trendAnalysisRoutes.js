const express = require('express');
const router = express.Router();
const googleTrendsService = require('../services/googleTrendsService');
const { protect } = require('../middlewares/authMiddleware');

// Get fashion trend analysis data
router.get('/analysis', protect, async (req, res) => {
  try {
    const { timeRange = '3M', regions = 'global' } = req.query;
    const selectedRegions = regions.split(',');
    
    const trendData = await googleTrendsService.getFashionTrendAnalysis(
      timeRange, 
      selectedRegions
    );

    if (!trendData) {
      return res.status(500).json({ 
        message: 'Failed to fetch trend data' 
      });
    }

    res.json(trendData);
  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Get specific keyword trends
router.get('/keyword/:keyword', protect, async (req, res) => {
  try {
    const { keyword } = req.params;
    const { timeframe = '3M', region = '' } = req.query;
    
    const trendData = await googleTrendsService.getTrendData(
      keyword, 
      timeframe, 
      region
    );

    res.json(trendData);
  } catch (error) {
    console.error('Keyword trend error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch keyword trends',
      error: error.message 
    });
  }
});

// Get related fashion queries
router.get('/related/:keyword', protect, async (req, res) => {
  try {
    const { keyword } = req.params;
    const { region = '' } = req.query;
    
    const relatedQueries = await googleTrendsService.getRelatedQueries(
      keyword, 
      region
    );

    res.json(relatedQueries);
  } catch (error) {
    console.error('Related queries error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch related queries',
      error: error.message 
    });
  }
});

module.exports = router;
