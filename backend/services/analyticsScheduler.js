const cron = require('node-cron');
const AnalyticsService = require('./analyticsService');
const Trend = require('../models/trendModel');

class AnalyticsScheduler {
    static init() {
        // Run daily analytics generation every day at 1 AM
        cron.schedule('0 1 * * *', async () => {
            console.log('Running daily analytics generation...');
            await this.generateDailyAnalytics();
        });

        // Run hourly analytics updates during business hours
        cron.schedule('0 9-17 * * *', async () => {
            console.log('Running hourly analytics updates...');
            await this.updateRealtimeAnalytics();
        });
    }

    static async generateDailyAnalytics() {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Get all active trends
            const trends = await Trend.find({ status: 'Active' });
            
            console.log(`Generating analytics for ${trends.length} trends...`);

            for (const trend of trends) {
                try {
                    await AnalyticsService.generateDailyAnalytics(trend._id, yesterday);
                    console.log(`Generated analytics for trend: ${trend.title}`);
                } catch (error) {
                    console.error(`Error generating analytics for trend ${trend._id}:`, error);
                }
            }

            console.log('Daily analytics generation completed');
        } catch (error) {
            console.error('Error in daily analytics generation:', error);
        }
    }

    static async updateRealtimeAnalytics() {
        try {
            const today = new Date();
            
            // Get trending/popular trends for real-time updates
            const trendingTrends = await Trend.find({ 
                status: 'Trending',
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
            });

            for (const trend of trendingTrends) {
                try {
                    await AnalyticsService.generateDailyAnalytics(trend._id, today);
                } catch (error) {
                    console.error(`Error updating realtime analytics for trend ${trend._id}:`, error);
                }
            }

            console.log('Realtime analytics update completed');
        } catch (error) {
            console.error('Error in realtime analytics update:', error);
        }
    }

    static async generateAnalyticsForTrend(trendId, date = new Date()) {
        try {
            return await AnalyticsService.generateDailyAnalytics(trendId, date);
        } catch (error) {
            console.error('Error generating analytics for specific trend:', error);
            throw error;
        }
    }
}

module.exports = AnalyticsScheduler;