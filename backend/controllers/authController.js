// backend/controllers/authController.js
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log('Registration attempt:', { 
            username, 
            email,
            timestamp: new Date().toISOString() 
        });

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Registration failed: User already exists', { email });
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        console.log('User registered successfully:', { 
            userId: user.id, 
            username: user.username,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error('Registration error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};