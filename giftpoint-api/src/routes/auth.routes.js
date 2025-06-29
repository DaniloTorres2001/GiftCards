const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

module.exports = router;