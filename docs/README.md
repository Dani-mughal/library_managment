# MUST Library Management System

> A modern, full-stack library management system for Mirpur University of Science & Technology (MUST) built with Node.js, Express, MySQL, and vanilla JavaScript.

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📚 Overview

The MUST Library Management System is a comprehensive web application that enables students to browse books, borrow materials, and manage their library account. The system features a beautiful, modern UI with secure authentication, real-time book availability tracking, and an intuitive dashboard.

### Key Features

- ✅ **Secure Authentication** - Student signup and login with bcrypt password hashing
- 📖 **Book Catalog** - Browse 50+ software engineering books with search and filtering
- 🖼️ **Visual Covers** - AI-generated book covers for enhanced user experience
- 📚 **Borrowing System** - Borrow books with automatic due date calculation (14 days)
- 👤 **User Profile** - View borrowed books with status tracking (Active/Overdue/Returned)
- 🎨 **Modern UI** - Premium glassmorphic design with smooth animations
- 🔍 **Real-time Search** - Instant filtering by title, author, or topic
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js & Express.js
- MySQL Database
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Single Page Application (SPA) architecture
- Vanilla CSS with CSS Variables
- Fetch API for backend communication

**Database:**
- MySQL 8.0+
- Relational schema with foreign key constraints
- Tables: `login_detail`, `books`, `borrowings`

---

## 📁 Project Structure

```
library_managment/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── books.js           # Book catalog endpoints
│   │   └── borrowings.js      # Borrowing management
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Main server file
├── database/
│   ├── 01_create_database.sql
│   ├── 02_create_users_table.sql
│   ├── 03_create_books_table.sql
│   ├── 04_update_book_images.sql
│   └── 05_borrowings_table.sql
├── front_end/
│   ├── images/
│   │   ├── logo.png
│   │   └── books/             # Book cover images
│   ├── must_student_login/
│   │   ├── login.html
│   │   └── signup.html
│   ├── must_student_dashboard/
│   │   ├── index.html         # Main SPA shell
│   │   ├── dashboard.css
│   │   ├── dashboard_view.html
│   │   ├── profile_view.html
│   │   └── chatbot_view.html
│   ├── must_book_details_page/
│   │   └── index.html
│   └── must_library_landing_page/
│       └── landing.html
├── tests/
│   ├── verify_backend.js
│   ├── verify_borrowing.js
│   └── verify_dashboard_fix.html
└── docs/                      # 📄 You are here!
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd library_managment
   ```

2. **Set up the database**
   ```bash
   mysql -u root -p < database/01_create_database.sql
   mysql -u root -p < database/02_create_users_table.sql
   mysql -u root -p < database/03_create_books_table.sql
   mysql -u root -p < database/05_borrowings_table.sql
   mysql -u root -p < database/04_update_book_images.sql
   ```

3. **Configure environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open the application**
   - Navigate to `http://localhost:3000`
   - Or directly open `http://localhost:3000/must_student_login/signup.html`

---

## 📖 Documentation

For detailed documentation, see the `docs/` folder:

- [Installation Guide](./docs/INSTALLATION.md) - Step-by-step setup instructions
- [API Documentation](./docs/API.md) - Complete API reference
- [User Guide](./docs/USER_GUIDE.md) - How to use the system
- [Developer Guide](./docs/DEVELOPER.md) - Contributing and architecture details
- [Database Schema](./docs/DATABASE.md) - Database structure and relationships
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

---

## 🔐 Default Credentials

**Test Account:**
- Student ID: `MUST-2024-555`
- Password: `test123`

**Create New Account:**
- Visit signup page and register with your details
- Student ID format: `MUST-YYYY-XXX`

---

## 🧪 Testing

Run backend API tests:
```bash
node tests/verify_backend.js
node tests/verify_borrowing.js
```

Open browser tests:
- `http://localhost:3000/tests/verify_ui.html`
- `http://localhost:3000/tests/verify_dashboard_fix.html`

---

## 🎨 Features Showcase

### Authentication
- Secure password hashing with bcrypt (10 rounds)
- Session management with sessionStorage
- Protected routes with session validation

### Book Catalog
- 50 pre-loaded software engineering books
- Real-time search and filtering
- Visual book covers for top titles
- Availability tracking

### Borrowing System
- One-click borrowing
- Automatic due date calculation (14 days)
- Real-time availability updates
- Overdue detection with visual indicators

### User Dashboard
- Single Page Application design
- Multiple views: Dashboard, AI Assistant, My Library
- Smooth transitions and animations
- Personalized with student name

---

## 🛠️ Development

### Running in Development Mode

```bash
cd backend
npm run dev  # If nodemon is configured
# or
npm start
```

### Code Style
- ES6+ JavaScript
- Async/await for asynchronous operations
- Modular route organization
- CSS custom properties for theming

---

## 🌐 Browser Support

- Chrome (recommended) - v90+
- Firefox - v88+
- Edge - v90+
- Safari - v14+

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributors

Developed by the MUST Library Development Team

---

## 📞 Support

For issues, questions, or contributions:
- Check the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Review existing documentation in `docs/`
- Contact the development team

---

## 🗺️ Roadmap

Future enhancements:
- [ ] Email notifications for due dates
- [ ] Book reservations
- [ ] Late fee calculations
- [ ] Admin dashboard
- [ ] Book reviews and ratings
- [ ] Export borrowing history
- [ ] Mobile app (React Native)

---

**Built with ❤️ for MUST students**
