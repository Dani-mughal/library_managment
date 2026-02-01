const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all books
router.get('/', (req, res) => {
    const query = 'SELECT * FROM books ORDER BY created_at DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching books:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, books: results });
    });
});

// Get a single book by ID
router.get('/:id', (req, res) => {
    const bookId = req.params.id;
    const query = 'SELECT * FROM books WHERE id = ?';

    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error('Error fetching book:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.json({ success: true, book: results[0] });
    });
});

module.exports = router;
