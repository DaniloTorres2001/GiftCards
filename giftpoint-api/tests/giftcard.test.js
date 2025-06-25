const request = require('supertest');
const app = require('../src/app');

let token;
let giftcardId;

// Test suite for gift card endpoints
beforeAll(async () => {
    // Register a user and log in to get a token
    const email = `gc${Date.now()}@mail.com`;
    const password = '123456';

    await request(app).post('/auth/register').send({ email, password });
    const login = await request(app).post('/auth/login').send({ email, password });

    token = login.body.token;
});

// Test cases for gift card management
describe('GiftCard Endpoints', () => {

    // Test case for creating a new gift card
    it('should create a new gift card', async () => {
        const res = await request(app)
            .post('/giftcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 100,
                currency: 'USD',
                expirationDate: '2025-12-31'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.amount).toBe(100);
        giftcardId = res.body.id;
    });

    // Test cases for gift card operations
    it('should list gift cards of the user', async () => {
        const res = await request(app)
            .get('/giftcards')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test case for getting a gift card by ID
    it('should get a gift card by ID', async () => {
        const res = await request(app)
            .get(`/giftcards/${giftcardId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', giftcardId);
    });

    // Test case for updating a gift card
    it('should update a gift card', async () => {
        const res = await request(app)
            .patch(`/giftcards/${giftcardId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                balance: 150,
                expirationDate: '2026-01-01'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('expirationDate', '2026-01-01');
    });

    let secondCardId;

    // Test case for transferring balance between gift cards
    it('should create a second gift card for transfer test', async () => {
        const res = await request(app)
            .post('/giftcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 50,
                currency: 'USD',
                expirationDate: '2025-12-31'
            });

        expect(res.statusCode).toEqual(201);
        secondCardId = res.body.id;
    });

    // Test case for transferring balance between two gift cards
    it('should transfer balance between two gift cards', async () => {
        const res = await request(app)
            .post('/giftcards/transfer')
            .set('Authorization', `Bearer ${token}`)
            .send({
                sourceCardId: giftcardId,
                destinationCardId: secondCardId,
                amount: 25
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('transfer');
        expect(res.body.transfer.sourceCard.id).toEqual(giftcardId);
        expect(res.body.transfer.destinationCard.id).toEqual(secondCardId);
    });

    // Test case for deleting a gift card
    it('should delete a gift card', async () => {
        const res = await request(app)
            .delete(`/giftcards/${secondCardId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
    });


});
