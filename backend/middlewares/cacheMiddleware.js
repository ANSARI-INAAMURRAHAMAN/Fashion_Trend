const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = 'cache-' + req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.send(JSON.parse(cachedResponse));
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, JSON.stringify(body), duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
};

module.exports = { cacheMiddleware };