// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Updated to correct filename
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
            return;
        }
    }

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
        return;
    }
});

module.exports = { protect };