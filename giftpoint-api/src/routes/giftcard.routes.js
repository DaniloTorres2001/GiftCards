const express = require('express');
const router = express.Router();
const giftcardController = require('../controllers/giftcard.controller');
const auth = require('../middlewares/auth.middleware');

// Get all gift cards route
router.use(auth);

router.get('/', giftcardController.getAll);
router.post('/', giftcardController.create);
router.get('/:id', giftcardController.getById);
router.patch('/:id', giftcardController.update);
router.delete('/:id', giftcardController.remove);
router.post('/transfer', giftcardController.transfer);

module.exports = router;
