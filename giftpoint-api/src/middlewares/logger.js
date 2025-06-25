// Middleware for logging HTTP requests

module.exports = (req, res, next) => {
    // Log the request method and URL
    const start = Date.now();
    res.on('finish', () => {
        // Log the response status and duration
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};