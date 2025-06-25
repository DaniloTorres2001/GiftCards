const db = require("../config/db");
const { isFutureDate } = require("../utils/validators");

const getAll = async (req, res) => {
    const userId = req.user.id;
    const giftCards = await db.getGiftCardsByUser(userId);
    res.json(giftCards);
};

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

const getById = async (req, res) => {
    const giftCard = await db.getGiftCardById(req.params.id);
    if (!giftCard || giftCard.userId !== req.user.id) {
        return res.status(404).json({ error: "Gift card not found" });
    }
    res.json(giftCard);
};

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

const transfer = async (req, res) => {
    const { sourceCardId, destinationCardId, amount } = req.body;
    const userId = req.user.id;

    // Validación de entrada básica
    if (!sourceCardId || !destinationCardId || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Parámetros requeridos: sourceCardId, destinationCardId y amount numérico' });
    }

    try {
        const source = await db.getGiftCardById(sourceCardId);
        const dest = await db.getGiftCardById(destinationCardId);

        // Validación de existencia
        if (!source || !dest) {
            return res.status(404).json({ error: 'Una o ambas gift cards no existen' });
        }

        // Validación de propiedad
        if (source.userId !== userId || dest.userId !== userId) {
            return res.status(403).json({ error: 'No tienes permiso sobre una de las gift cards' });
        }

        // Validación de monto
        if (amount <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a cero' });
        }

        // Validación de saldo
        if (source.amount < amount) {
            return res.status(400).json({ error: 'Saldo insuficiente en la tarjeta de origen' });
        }

        // Ejecución
        const result = await db.transferBalance(userId, sourceCardId, destinationCardId, amount);
        res.status(200).json({
            message: 'Transferencia exitosa',
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
