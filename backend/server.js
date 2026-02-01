const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();

const path = require('path');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the 'front_end' directory
// This allows you to visit: http://localhost:3000/must_student_login/login.html
app.use(express.static(path.join(__dirname, '../front_end')));

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint - Redirect to landing page
app.get('/', (req, res) => {
    res.redirect('/must_library_landing_page/landing.html');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 MUST Library Management System - Backend Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
    console.log('Available Endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/auth/signup`);
    console.log(`  POST http://localhost:${PORT}/api/auth/login`);
    console.log('='.repeat(50));
});
