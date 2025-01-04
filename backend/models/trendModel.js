const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Trend title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Trend description is required']
    },
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter'],
        required: true
    },
    category: {
        type: String,
        enum: ['Apparel', 'Accessories', 'Footwear', 'Beauty', 'Lifestyle'],
        required: true
    },
    region: {
        type: String,
        enum: ['Global', 'North America', 'Europe', 'Asia', 'Other'],
        required: true
    },
    imageUrls: [{
        type: String,
        required: true
    }],
    engagementRate: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Trending', 'Archived'],
        default: 'Active'
    },
    tags: [{
        type: String,
        trim: true
    }],
    aiPredictions: {
        growthPotential: Number,
        marketFit: Number
    },
    price: {
        min: Number,
        max: Number
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual field to alias createdBy as user
trendSchema.virtual('user', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

// Add virtual populate for comments
trendSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'trendId'
});

trendSchema.pre('find', function() {
    this.populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'username'
        }
    });
});

trendSchema.post('save', async function(doc) {
    try {
        const User = mongoose.model('User');
        const trendsCount = await this.model('Trend').countDocuments({ createdBy: doc.createdBy });
        await User.findByIdAndUpdate(doc.createdBy, { trendsCount });
    } catch (error) {
        console.error('Error updating user trends count:', error);
    }
});

module.exports = mongoose.models.Trend || mongoose.model('Trend', trendSchema);