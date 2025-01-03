require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');

const corsMiddleware = require('./middlewares/corsMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trendRoutes = require('./routes/trendRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import middleware
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
// backend/server.js
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware for API requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Apply CORS middleware to all routes
app.use(corsMiddleware);

// MongoDB connection
mongoose.set('strictQuery', true); // Add this line to suppress the warning
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true // Fix the typo here
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/meetings', require('./routes/meetingsRoutes'));
// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Add error handling for 404
app.use((req, res, next) => {
    console.log('404 Error for:', req.originalUrl);
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.originalUrl}`
    });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server first
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Initialize Socket.IO after server creation
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('joinTrend', (trendId) => {
        socket.join(`trend_${trendId}`);
    });
    
    socket.on('joinUser', (userId) => {
        socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Error handling middleware should be last
app.use(errorHandler);