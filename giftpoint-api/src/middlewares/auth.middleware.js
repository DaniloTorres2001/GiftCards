const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    // Check if the authorization header is present
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

