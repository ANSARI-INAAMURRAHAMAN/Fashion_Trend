// utils/validators.js
const { body } = require('express-validator');

const validators = {
    registerValidation: [
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    
    trendValidation: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required'),
        body('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category ID')
    ]
};

module.exports = validators;