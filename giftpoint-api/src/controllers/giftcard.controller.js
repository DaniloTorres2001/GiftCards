const db = require("../config/db");
const { isFutureDate } = require("../utils/validators");

// Get all gift cards for the authenticated user
const getAll = async (req, res) => {
    const userId = req.user.id;
    const giftCards = await db.getGiftCardsByUser(userId);
    res.json(giftCards);
};

// Create a new gift card
const create = async (req, res) => {
    const userId = req.user.id;
    const { amount, currency, expirationDate } = req.body;

    if (amount <= 0 || !isFutureDate(expirationDate)) {
        return res.status(400).json({ error: "Invalid amount or expiration date" });
    }

    try {
        const giftcard = await db.createGiftCard(userId, amount, currency, expirationDate);
        res.status(201).json(giftcard);
    } catch (error) {
        console.error("Error creating gift card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a gift card by ID for the authenticated user
const getById = async (req, res) => {
    const giftCard = await db.getGiftCardById(req.params.id);
    if (!giftCard || giftCard.userId !== req.user.id) {
        return res.status(404).json({ error: "Gift card not found" });
    }
    res.json(giftCard);
};

// Update a gift card
const update = async (req, res) => {
    const { balance, expirationDate } = req.body;
    const giftCard = await db.getGiftCardById(req.params.id);

    if (!giftCard || giftCard.userId !== req.user.id) {
        return res.status(404).json({ error: "Gift card not found" });
    }

    try {
        await db.updateGiftCard(req.params.id, balance, expirationDate);
        const updatedCard = await db.getGiftCardById(req.params.id);
        res.json(updatedCard);
    } catch (error) {
        console.error("Error updating gift card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a gift card
const remove = async (req, res) => {
    const giftCard = await db.getGiftCardById(req.params.id);

    if (!giftCard || giftCard.userId !== req.user.id) {
        return res.status(404).json({ error: "Gift card not found" });
    }

    try {
        await db.deleteGiftCard(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting gift card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Transfer balance between gift cards
const transfer = async (req, res) => {
    const { sourceCardId, destinationCardId, amount } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!sourceCardId || !destinationCardId || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Required Parameters: sourceCardId, destinationCardId y amount numérico' });
    }

    try {
        // Fetch source and destination gift cards
        const source = await db.getGiftCardById(sourceCardId);
        const dest = await db.getGiftCardById(destinationCardId);

        // Validate existence
        if (!source || !dest) {
            return res.status(404).json({ error: 'One or both gift cards do not exist' });
        }

        // Validate ownership
        if (source.userId !== userId || dest.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission over one of the gift cards' });
        }

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({ error: 'The amount must be greater than zero' });
        }

        // Validate balance
        if (source.amount < amount) {
            return res.status(400).json({ error: 'Insufficient balance on the source card' });
        }

        // Execution
        const result = await db.transferBalance(userId, sourceCardId, destinationCardId, amount);
        res.status(200).json({
            message: 'Transfer successful',
            transfer: result
        });

    } catch (error) {
        console.error('Error transferring balance:', error.message);
        res.status(500).json({ error: 'Error interno en la transferencia' });
    }
};


module.exports = {
    getAll,
    create,
    getById,
    update,
    remove,
    transfer
};
