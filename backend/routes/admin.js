const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add a new book
router.post('/books', (req, res) => {
    const {
        title, author, department, description, cover_color,
        image_url, shelf_location, total_copies, available_copies, topics
    } = req.body;

    const query = `
        INSERT INTO books (
            title, author, department, description, cover_color,
            image_url, shelf_location, total_copies, available_copies, topics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title, author, department, description, cover_color,
        image_url, shelf_location, total_copies, available_copies, topics
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Book added successfully', bookId: result.insertId });
    });
});

// Update an existing book
router.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const {
        title, author, department, description, cover_color,
        image_url, shelf_location, total_copies, available_copies, topics
    } = req.body;

    const query = `
        UPDATE books SET
            title = ?, author = ?, department = ?, description = ?,
            cover_color = ?, image_url = ?, shelf_location = ?,
            total_copies = ?, available_copies = ?, topics = ?
        WHERE id = ?
    `;

    const values = [
        title, author, department, description, cover_color,
        image_url, shelf_location, total_copies, available_copies, topics,
        bookId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating book:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({ success: true, message: 'Book updated successfully' });
    });
});

// Delete a book
router.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const query = 'DELETE FROM books WHERE id = ?';

    db.query(query, [bookId], (err, result) => {
        if (err) {
            console.error('Error deleting book:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({ success: true, message: 'Book deleted successfully' });
    });
});

module.exports = router;
