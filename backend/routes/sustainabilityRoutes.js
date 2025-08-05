const express = require('express');
const router = express.Router();
const newsAPIService = require('../services/newsAPIService');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/sustainability/data
// @desc Get overall sustainability data including carbon footprint and waste metrics
// @access Public
router.get('/data', asyncHandler(async (req, res) => {
  const data = await newsAPIService.getSustainableFashionNews();
  
  res.json({
    success: true,
    data: {
      carbonFootprint: data.carbonFootprint,
      wasteReduced: data.wasteReduced,
      lastUpdated: new Date().toISOString()
    }
  });
}));

// GET /api/sustainability/trends
// @desc Get latest sustainable fashion trends
// @access Public
router.get('/trends', asyncHandler(async (req, res) => {
  const data = await newsAPIService.getSustainableFashionNews();
  
  res.json({
    success: true,
    data: {
      trends: data.sustainableTrends,
      totalTrends: data.sustainableTrends.length,
      lastUpdated: new Date().toISOString()
    }
  });
}));

// GET /api/sustainability/recommendations
// @desc Get sustainability recommendations
// @access Public
router.get('/recommendations', asyncHandler(async (req, res) => {
  const data = await newsAPIService.getSustainableFashionNews();
  
  res.json({
    success: true,
    data: {
      recommendations: data.recommendations,
      totalRecommendations: data.recommendations.length,
      lastUpdated: new Date().toISOString()
    }
  });
}));

// GET /api/sustainability/full
// @desc Get complete sustainability dashboard data
// @access Public
router.get('/full', asyncHandler(async (req, res) => {
  const data = await newsAPIService.getSustainableFashionNews();
  
  res.json({
    success: true,
    data: {
      ...data,
      lastUpdated: new Date().toISOString()
    }
  });
}));

module.exports = router;
