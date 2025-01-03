
const express = require('express');
const app = express();
const trendRoutes = require('./routes/trendRoutes');

// ...existing middleware...

// Routes
app.use('/api/trends', trendRoutes);
// ...existing routes...

module.exports = app;