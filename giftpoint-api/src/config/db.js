const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Create tables if they do not exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS giftcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        expirationDate TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);
});

// Database operations

// User operations
const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        // Validate input
        db.get("SELECT * FROM users WHERE email = ?",
            [email], (err, row) => {
                if (err) {
                    console.error("Error fetching user:", err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
    });
}
// Create a new user
const createUser = (email, password) => {
    return new Promise((resolve, reject) => {
        // Validate input
        db.run("INSERT INTO users (email, password) VALUES (?, ?)",
            [email, password], function (err) {
                if (err) {
                    console.error("Error creating user:", err.message);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, email });
                }
            });
    });
}
// Gift card operations

// Get all gift cards for a user
const getGiftCardsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        // Ensure the user exists before attempting to fetch gift cards
        db.all("SELECT * FROM giftcards WHERE userId = ?",
            [userId], (err, rows) => {
                if (err) {
                    console.error("Error fetching gift cards:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// Get a gift card by ID
const getGiftCardById = (id) => {
    return new Promise((resolve, reject) => {
        // Ensure the gift card exists before attempting to fetch
        db.get("SELECT * FROM giftcards WHERE id = ?",
            [id], (err, row) => {
                if (err) {
                    console.error("Error fetching gift card:", err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
    });
}

// Create a new gift card
const createGiftCard = (userId, amount, currency, expirationDate) => {
    return new Promise((resolve, reject) => {
        // Validate input
        db.run("INSERT INTO giftcards (userId, amount, currency, expirationDate) VALUES (?, ?, ?, ?)",
            [userId, amount, currency, expirationDate], function (err) {
                if (err) {
                    console.error("Error creating gift card:", err.message);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, userId, amount, currency, expirationDate });
                }
            });
    });
}

// Update an existing gift card
const updateGiftCard = (id, balance, expirationDate) => {
    return new Promise((resolve, reject) => {
        // Ensure the gift card exists before attempting to update
        db.run("UPDATE giftcards SET amount = ?, expirationDate = ? WHERE id = ?",
            [balance, expirationDate, id], function (err) {
                if (err) {
                    console.error("Error updating gift card:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
    });
}

// Delete a gift card
const deleteGiftCard = (id) => {
    return new Promise((resolve, reject) => {
        // Ensure the gift card exists before attempting to delete
        db.run("DELETE FROM giftcards WHERE id = ?",
            [id], function (err) {
                if (err) {
                    console.error("Error deleting gift card:", err.message);
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
    });
}

// Transfer balance between gift cards
const transferBalance = async (userId, sourceId, destId, amount) => {
    if (amount <= 0) throw new Error("Amount must be greater than zero");

    // Validate source and destination gift cards
    const source = await getGiftCardById(sourceId);
    const dest = await getGiftCardById(destId);

    // Debugging output
    console.log("🔎 SOURCE:", source);
    console.log("🔎 DEST:", dest);

    if (!source || !dest) throw new Error("Source or destination gift card not found");
    if (source.userId !== userId || dest.userId !== userId) {
        throw new Error("User does not own the source or destination gift card");
    }
    if (source.amount < amount) throw new Error("Insufficient balance for transfer");

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Update source gift card
            db.run("UPDATE giftcards SET amount = amount - ? WHERE id = ?", [amount, sourceId], (err) => {
                if (err) {
                    console.error("Error updating source gift card:", err.message);
                    return reject(err);
                }
                // Update destination gift card
                db.run("UPDATE giftcards SET amount = amount + ? WHERE id = ?", [amount, destId], (err) => {
                    if (err) {
                        console.error("Error updating destination gift card:", err.message);
                        return reject(err);
                    }
                    resolve({
                        sourceCard: { id: sourceId, newBalance: source.amount - amount },
                        destinationCard: { id: destId, newBalance: dest.amount + amount }
                    });
                });
            });
        });
    });
}
module.exports = {
    db,
    getUserByEmail,
    createUser,
    getGiftCardsByUser,
    getGiftCardById,
    createGiftCard,
    updateGiftCard,
    deleteGiftCard,
    transferBalance,
};
