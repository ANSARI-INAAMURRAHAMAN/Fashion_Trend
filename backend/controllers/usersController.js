//controllers//usersController.js
const User = require('../models/userModel');
exports.getProfile = async (req, res) => {
    try {
        console.log('User ID in request:', req.user._id);
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
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
