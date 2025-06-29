const mongoose = require('mongoose');

// Schema for tracking user interactions with trends
const trendInteractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    trendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend',
        required: true,
        index: true
    },
    interactionType: {
        type: String,
        enum: ['view', 'like', 'comment', 'share', 'save', 'click'],
        required: true
    },
    sessionId: {
        type: String,
        index: true
    },
    userAgent: String,
    ipAddress: String,
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        duration: Number, // for view interactions
        clickPosition: String, // for click tracking
        referrer: String,
        platform: String
    }
}, {
    timestamps: true
});

// Compound indexes for analytics queries
trendInteractionSchema.index({ trendId: 1, timestamp: -1 });
trendInteractionSchema.index({ userId: 1, timestamp: -1 });
trendInteractionSchema.index({ interactionType: 1, timestamp: -1 });

module.exports = mongoose.model('TrendInteraction', trendInteractionSchema);