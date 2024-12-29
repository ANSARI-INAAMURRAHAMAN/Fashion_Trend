const { User } = require('../models/userModel');

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
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
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};