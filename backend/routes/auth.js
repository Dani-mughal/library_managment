const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ==========================================
// SIGNUP ENDPOINT
// ==========================================
router.post('/signup', async (req, res) => {
    try {
        const { student_name, student_id, password } = req.body;

        // Validate required fields
        if (!student_name || !student_id || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (student_name, student_id, password)'
            });
        }

        // Check if student_id already exists
        const checkQuery = 'SELECT * FROM login_detail WHERE student_id = ?';
        db.query(checkQuery, [student_id], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again later.'
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Student ID already exists. Please use a different ID or login.'
                });
            }

            // Hash password
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);

            // Insert new student
            const insertQuery = 'INSERT INTO login_detail (student_name, student_id, password_hash) VALUES (?, ?, ?)';
            db.query(insertQuery, [student_name, student_id, password_hash], (err, result) => {
                if (err) {
                    console.error('Insert error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create account. Please try again.'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Account created successfully! You can now login.'
                });
            });
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// ==========================================
// LOGIN ENDPOINT
// ==========================================
router.post('/login', (req, res) => {
    try {
        const { student_id, password } = req.body;

        // Validate required fields
        if (!student_id || !password) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and password are required'
            });
        }

        // Find student by student_id
        const query = 'SELECT * FROM login_detail WHERE student_id = ?';
        db.query(query, [student_id], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again later.'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid student ID or password'
                });
            }

            const student = results[0];

            // Compare password with hash
            const isPasswordValid = await bcrypt.compare(password, student.password_hash);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid student ID or password'
                });
            }

            // Login successful
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                student_name: student.student_name,
                student_id: student.student_id
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

module.exports = router;
