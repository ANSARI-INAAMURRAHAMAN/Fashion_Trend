const mongoose = require('mongoose');

// Schema for tracking daily trend analytics
const trendAnalyticsSchema = new mongoose.Schema({
    trendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    metrics: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        engagement: {
            type: Number,
            default: 0
        },
        popularityScore: {
            type: Number,
            default: 0
        },
        retentionRate: {
            type: Number,
            default: 0
        },
        growthRate: {
            type: Number,
            default: 0
        },
        revenue: {
            type: Number,
            default: 0
        },
        activeUsers: {
            type: Number,
            default: 0
        }
    },
    demographics: {
        regions: [{
            name: String,
            value: Number,
            percentage: Number
        }],
        ageGroups: [{
            group: String,
            count: Number,
            percentage: Number
        }],
        genders: [{
            type: String,
            count: Number,
            percentage: Number
        }]
    },
    businessMetrics: {
        predictedSales: {
            type: Number,
            default: 0
        },
        markdownRisk: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        profitMargin: {
            type: Number,
            default: 0
        },
        marketGrowth: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Compound index for efficient querying
trendAnalyticsSchema.index({ trendId: 1, date: -1 });
trendAnalyticsSchema.index({ date: -1 });

module.exports = mongoose.model('TrendAnalytics', trendAnalyticsSchema);