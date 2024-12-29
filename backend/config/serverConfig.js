// config/serverConfig.js
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const configureServer = (app) => {
    // Security middleware
    app.use(helmet());

    // Compression middleware
    app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Static files
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../frontend/build')));
    }

    return app;
};

module.exports = configureServer;