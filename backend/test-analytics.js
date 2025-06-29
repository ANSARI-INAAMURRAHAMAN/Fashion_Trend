const mongoose = require('mongoose');
const AnalyticsService = require('./services/analyticsService');
// Import all required models
const User = require('./models/userModel');
const Trend = require('./models/trendModel');
const TrendAnalytics = require('./models/trendAnalyticsModel');
const TrendInteraction = require('./models/trendInteractionModel');
require('dotenv').config();

// Test the analytics system
async function testAnalyticsSystem() {
    try {
        console.log('🚀 Testing Analytics System...\n');
        
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashiontrend');
        console.log('✅ Connected to MongoDB');

        // Test data
        const testUserId = new mongoose.Types.ObjectId();
        const testTrendId = new mongoose.Types.ObjectId();
        
        console.log('\n📊 Testing Interaction Tracking...');
        
        // Test various interactions
        const interactions = [
            { type: 'view', metadata: { duration: 5000 } },
            { type: 'like', metadata: {} },
            { type: 'comment', metadata: { content: 'Great trend!' } },
            { type: 'share', metadata: { platform: 'twitter' } }
        ];
        
        for (const interaction of interactions) {
            await AnalyticsService.trackInteraction(
                testUserId, 
                testTrendId, 
                interaction.type, 
                interaction.metadata
            );
            console.log(`✅ Tracked ${interaction.type} interaction`);
        }
        
        console.log('\n📈 Testing Daily Analytics Generation...');
        
        // Generate analytics for today
        const analytics = await AnalyticsService.generateDailyAnalytics(testTrendId);
        console.log('✅ Generated daily analytics:', {
            views: analytics.metrics.views,
            likes: analytics.metrics.likes,
            comments: analytics.metrics.comments,
            shares: analytics.metrics.shares,
            engagement: analytics.metrics.engagement.toFixed(2) + '%'
        });
        
        console.log('\n🎯 Testing Aggregated Analytics...');
        
        // Get aggregated analytics
        const aggregated = await AnalyticsService.getAggregatedAnalytics(testTrendId, '30d');
        console.log('✅ Retrieved aggregated analytics:', {
            strengthIndicators: aggregated.strengthIndicators,
            evolutionDataPoints: aggregated.evolutionData.length,
            demographicRegions: aggregated.demographics.regions.length,
            businessImpact: aggregated.businessImpact
        });
        
        console.log('\n🔍 Testing Analytics Retrieval...');
        
        // Test date range analytics
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const rangeAnalytics = await AnalyticsService.getTrendAnalytics(testTrendId, startDate, new Date());
        console.log(`✅ Retrieved ${rangeAnalytics.length} days of analytics data`);
        
        console.log('\n🎉 All tests passed! Analytics system is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Helper function to create sample data for testing
async function createSampleData() {
    const Trend = require('./models/trendModel');
    const User = require('./models/userModel');
    
    try {
        // Create a sample user if none exists
        let user = await User.findOne();
        if (!user) {
            user = new User({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                profile: {
                    age: 25,
                    gender: 'female',
                    region: 'North America'
                }
            });
            await user.save();
            console.log('✅ Created sample user');
        }
        
        // Create a sample trend if none exists
        let trend = await Trend.findOne();
        if (!trend) {
            trend = new Trend({
                title: 'Sample Trend',
                description: 'A sample trend for testing analytics',
                season: 'Spring',
                category: 'Apparel',
                region: 'Global',
                imageUrls: ['https://example.com/image.jpg'],
                createdBy: user._id,
                tags: ['sample', 'test'],
                status: 'Active'
            });
            await trend.save();
            console.log('✅ Created sample trend');
        }
        
        return { user, trend };
    } catch (error) {
        console.error('❌ Error creating sample data:', error.message);
        throw error;
    }
}

// Run tests
if (require.main === module) {
    console.log('🧪 Fashion Trend Analytics System Test\n');
    testAnalyticsSystem();
}

module.exports = { testAnalyticsSystem, createSampleData };
