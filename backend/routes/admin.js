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

// --- Borrowing Management ---

// Get all borrowing records with student and book details
router.get('/borrowings', (req, res) => {
    const query = `
        SELECT 
            b.*, 
            COALESCE(ld.student_name, 'Unknown Student') as student_name, 
            COALESCE(bk.title, 'Removed Book') as book_title,
            bk.author as book_author
        FROM borrowings b
        LEFT JOIN login_detail ld ON b.student_id = ld.student_id
        LEFT JOIN books bk ON b.book_id = bk.id
        ORDER BY b.borrowed_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching borrowings:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, borrowings: results });
    });
});

// Update borrowing status
router.put('/borrowings/:id', (req, res) => {
    const borrowingId = req.params.id;
    const { status } = req.body; // 'active', 'returned', 'overdue'

    // First, get the current record to know the book_id and previous status
    const getQuery = 'SELECT book_id, status FROM borrowings WHERE id = ?';

    db.query(getQuery, [borrowingId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: 'Borrowing record not found' });
        }

        const record = results[0];
        const oldStatus = record.status;
        const bookId = record.book_id;

        // Start a transaction if we need to update book availability
        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ success: false, message: 'Transaction error' });

            let updateQuery = 'UPDATE borrowings SET status = ?';
            const queryParams = [status];

            if (status === 'returned') {
                updateQuery += ', returned_date = CURRENT_TIMESTAMP';
            } else {
                updateQuery += ', returned_date = NULL';
            }

            updateQuery += ' WHERE id = ?';
            queryParams.push(borrowingId);

            db.query(updateQuery, queryParams, (err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Update failed' });
                    });
                }

                // If moving to 'returned' from something else, increment available_copies
                // If moving FROM 'returned' to something else, decrement available_copies
                let availabilityQuery = null;
                if (status === 'returned' && oldStatus !== 'returned') {
                    availabilityQuery = 'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?';
                } else if (status !== 'returned' && oldStatus === 'returned') {
                    availabilityQuery = 'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?';
                }

                if (availabilityQuery) {
                    db.query(availabilityQuery, [bookId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ success: false, message: 'Availability update failed' });
                            });
                        }
                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));
                            res.json({ success: true, message: 'Status and availability updated' });
                        });
                    });
                } else {
                    db.commit((err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));
                        res.json({ success: true, message: 'Status updated' });
                    });
                }
            });
        });
    });
});

module.exports = router;
