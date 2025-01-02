const Joi = require('joi');

const trendValidators = {
    searchSchema: Joi.object({
        q: Joi.string().required().min(2).max(50)
    }),

    filterSchema: Joi.object({
        season: Joi.array().items(Joi.string().valid('Spring', 'Summer', 'Fall', 'Winter', 'All Season')),
        region: Joi.array().items(Joi.string()),
        gender: Joi.array().items(Joi.string().valid('Men', 'Women', 'Unisex')),
        categories: Joi.array().items(Joi.string())
    }),

    createTrendSchema: Joi.object({
        name: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(10),
        popularity: Joi.number().min(0).max(100),
        images: Joi.array().items(Joi.string().uri()).min(1).required(),
        categories: Joi.array().items(Joi.string()).min(1).required(),
        season: Joi.string().valid('Spring', 'Summer', 'Fall', 'Winter', 'All Season').required(),
        region: Joi.string().required(),
        gender: Joi.string().valid('Men', 'Women', 'Unisex').required()
    })
};

module.exports = {
    trendValidators
};