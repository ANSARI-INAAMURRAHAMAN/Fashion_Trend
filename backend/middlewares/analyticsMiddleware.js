const AnalyticsService = require('../services/analyticsService');

// Middleware to automatically track trend views
const trackTrendView = async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to track successful trend responses
    res.json = function(body) {
        // Check if this is a successful trend response
        if (body && body.success && body.data && req.user) {
            // Handle single trend response
            if (body.data._id) {
                trackViewAsync(req.user._id, body.data._id, req);
            }
            // Handle multiple trends response
            else if (Array.isArray(body.data)) {
                body.data.forEach(trend => {
                    if (trend._id) {
                        trackViewAsync(req.user._id, trend._id, req);
                    }
                });
            }
        }
        
        // Call original json method
        return originalJson.call(this, body);
    };
    
    next();
};

// Async function to track views without blocking response
async function trackViewAsync(userId, trendId, req) {
    try {
        await AnalyticsService.trackInteraction(userId, trendId, 'view', {
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip,
            referrer: req.get('Referer'),
            timestamp: new Date()
        });
    } catch (error) {
        // Silent failure - don't log to avoid spam
        // console.warn('Analytics tracking failed:', error.message);
    }
}

// Middleware to track specific interactions
const trackInteraction = (interactionType) => {
    return async (req, res, next) => {
        if (req.user && req.body && req.body.trendId) {
            try {
                await AnalyticsService.trackInteraction(
                    req.user._id, 
                    req.body.trendId, 
                    interactionType, 
                    {
                        userAgent: req.get('User-Agent'),
                        ipAddress: req.ip,
                        timestamp: new Date()
                    }
                );
            } catch (error) {
                // Silent failure
            }
        }
        next();
    };
};

module.exports = {
    trackTrendView,
    trackInteraction
};
