// config/corsConfig.js
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;