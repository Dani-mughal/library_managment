const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all borrowings for a specific student
router.get('/:student_id', (req, res) => {
    const studentId = req.params.student_id;

    const query = `
        SELECT 
            b.id as borrowing_id,
            b.borrowed_date,
            b.due_date,
            b.returned_date,
            b.status,
            bk.id as book_id,
            bk.title,
            bk.author,
            bk.image_url,
            bk.cover_color,
            bk.department
        FROM borrowings b
        INNER JOIN books bk ON b.book_id = bk.id
        WHERE b.student_id = ?
        ORDER BY b.borrowed_date DESC
    `;

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching borrowings:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, borrowings: results });
    });
});

// Borrow a book
router.post('/', (req, res) => {
    const { student_id, book_id } = req.body;

    if (!student_id || !book_id) {
        return res.status(400).json({ success: false, message: 'student_id and book_id are required' });
    }

    // Check if book is available
    const checkQuery = 'SELECT available_copies FROM books WHERE id = ?';

    db.query(checkQuery, [book_id], (err, results) => {
        if (err) {
            console.error('Error checking book availability:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        if (results[0].available_copies <= 0) {
            return res.status(400).json({ success: false, message: 'Book not available' });
        }

        // Calculate due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const dueDateStr = dueDate.toISOString().split('T')[0];

        // Create borrowing record
        const borrowQuery = 'INSERT INTO borrowings (student_id, book_id, due_date) VALUES (?, ?, ?)';

        db.query(borrowQuery, [student_id, book_id, dueDateStr], (err, result) => {
            if (err) {
                console.error('Error creating borrowing:', err);
                return res.status(500).json({ success: false, message: 'Failed to borrow book' });
            }

            // Decrement available_copies
            const updateQuery = 'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?';

            db.query(updateQuery, [book_id], (err) => {
                if (err) {
                    console.error('Error updating book availability:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update availability' });
                }

                res.json({
                    success: true,
                    message: 'Book borrowed successfully',
                    borrowing_id: result.insertId,
                    due_date: dueDateStr
                });
            });
        });
    });
});

// Return a borrowed book
router.put('/:id/return', (req, res) => {
    const borrowingId = req.params.id;

    // Get the book_id first
    const getBookQuery = 'SELECT book_id FROM borrowings WHERE id = ? AND status = "active"';

    db.query(getBookQuery, [borrowingId], (err, results) => {
        if (err) {
            console.error('Error fetching borrowing:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Active borrowing not found' });
        }

        const bookId = results[0].book_id;
        const returnDate = new Date().toISOString().split('T')[0];

        // Update borrowing status
        const returnQuery = 'UPDATE borrowings SET status = "returned", returned_date = ? WHERE id = ?';

        db.query(returnQuery, [returnDate, borrowingId], (err) => {
            if (err) {
                console.error('Error returning book:', err);
                return res.status(500).json({ success: false, message: 'Failed to return book' });
            }

            // Increment available_copies
            const updateQuery = 'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?';

            db.query(updateQuery, [bookId], (err) => {
                if (err) {
                    console.error('Error updating book availability:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update availability' });
                }

                res.json({
                    success: true,
                    message: 'Book returned successfully',
                    returned_date: returnDate
                });
            });
        });
    });
});

module.exports = router;
