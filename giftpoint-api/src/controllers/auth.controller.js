const bycrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const db = require('../config/db');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    try {
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bycrypt.hash(password, 10);

        const user = await db.createUser(email, hashedPassword);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const match = await bycrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ id: user.id });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login
};