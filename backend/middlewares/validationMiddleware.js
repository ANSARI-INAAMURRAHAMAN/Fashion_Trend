// middlewares/validationMiddleware.js
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

exports.validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(new ErrorResponse(error.details[0].message, 400));
    }
  };
};