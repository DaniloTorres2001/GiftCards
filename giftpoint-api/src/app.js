const express = require('express');
const authRoutes = require('./routes/auth.routes');
const giftcardRoutes = require('./routes/giftcard.routes');
const logger = require('./middlewares/logger');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(logger);    // Custom logger middleware

// Define routes
app.use('/auth', authRoutes);
app.use('/giftcards', giftcardRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the GiftPoint API!');
});

module.exports = app;

