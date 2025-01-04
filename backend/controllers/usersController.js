//controllers//usersController.js
const User = require('../models/userModel');
const Trend = require('../models/trendModel');
const Comment = require('../models/commentModel');

// Helper function to get counts
const getUserCounts = async (userId) => {
    const [trendsCount, commentsCount] = await Promise.all([
        Trend.countDocuments({ createdBy: userId }),
        Comment.countDocuments({ user: userId })
    ]);
    return { trendsCount, commentsCount };
};

exports.getProfile = async (req, res) => {
    try {
        console.log('User ID in request:', req.user._id);
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get fresh counts
        const counts = await getUserCounts(user._id);
        
        // Update user counts in database
        await User.findByIdAndUpdate(user._id, counts);
        
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            trendsCount: counts.trendsCount,
            teamsCount: user.teamsCount || 0,
            commentsCount: counts.commentsCount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a new endpoint to refresh counts
exports.refreshCounts = async (req, res) => {
    try {
        const counts = await getUserCounts(req.user._id);
        await User.findByIdAndUpdate(req.user._id, counts);
        res.json(counts);
    } catch (error) {
        console.error('Error refreshing counts:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.preferences = req.body.preferences || user.preferences;
        
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            preferences: updatedUser.preferences
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message });
    }
};
