// middlewares/validationMiddleware.js
const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');

const trendSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required(),
    season: Joi.string().valid('Spring', 'Summer', 'Fall', 'Winter').required(),
    category: Joi.string().valid('Apparel', 'Accessories', 'Footwear', 'Beauty', 'Lifestyle').required(),
    region: Joi.string().valid('Global', 'North America', 'Europe', 'Asia', 'Other').required(),
    imageUrls: Joi.array().items(Joi.string()).min(1).required(),
    status: Joi.string().valid('Draft', 'Active', 'Trending', 'Archived').default('Active'),
    tags: Joi.array().items(Joi.string()),
    price: Joi.object({
        min: Joi.number().required(),
        max: Joi.number().required()
    }),
    // Add new fields to validation
    engagementRate: Joi.number().min(0).max(100).default(0),
    aiPredictions: Joi.object({
        growthPotential: Joi.number().min(0).max(100).required(),
        marketFit: Joi.number().min(0).max(100).required()
    }).required()
});

exports.validateTrendInput = (req, res, next) => {
    const { error } = trendSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const message = error.details.map(detail => detail.message).join(', ');
        return next(new ErrorResponse(message, 400));
    }
    
    next();
};