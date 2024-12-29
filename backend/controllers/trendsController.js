const Trend = require('../models/trendModel');

const trendsController = {
  async createTrend(req, res) {
    try {
      const { title, description, category, metrics, tags } = req.body;
      const trend = await Trend.create({
        title,
        description,
        category,
        metrics,
        tags,
        createdBy: req.user._id
      });
      res.status(201).json(trend);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTrends(req, res) {
    try {
      const trends = await Trend.find();
      res.status(200).json(trends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTrendById(req, res) {
    try {
      const trend = await Trend.findById(req.params.id);
      if (!trend) {
        return res.status(404).json({ message: 'Trend not found' });
      }
      res.status(200).json(trend);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = trendsController;