const jwt = require('jsonwebtoken');

// Load environment variables from .env file
const secret = process.env.JWT_SECRET || 'fallback_secret';

// Ensure the secret is set
const generateToken = (payload, options = { expiresIn: '1h' }) => {
    return jwt.sign(payload, secret, options);
};

// Verify a JWT token
const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
};
