const request = require('supertest');
const app = require('../src/app');

// Test suite for authentication endpoints
describe('Auth Endpoints', () => {
    let email = `test${Date.now()}@example.com`;
    let password = '123456';

    // Test cases for user registration and login
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ email, password });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toBe(email);
    });

    // Test case for user login
    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email, password });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
