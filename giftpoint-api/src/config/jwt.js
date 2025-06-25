const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (payload, options = { expiresIn: '1h' }) => {
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
};
