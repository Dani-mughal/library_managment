# Developer Guide

Welcome to the MUST Library Management System developer documentation!

---

## Development Setup

### Prerequisites

- Node.js v14+
- MySQL 8.0+
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
git clone <repository-url>
cd library_managment
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm start
```

---

## Project Architecture

### Backend (Node.js + Express)

```
backend/
├── config/
│   └── db.js           # MySQL connection pooling
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── books.js        # Book catalog routes
│   └── borrowings.js   # Borrowing management routes
├── .env                # Environment variables
├── package.json
└── server.js           # Main application entry
```

**Design Patterns:**
- **MVC-like structure**: Routes handle requests, database is model layer
- **Modular routing**: Each feature has its own route file
- **Connection pooling**: Reuses database connections efficiently

### Frontend (Vanilla JavaScript)

```
front_end/
├── must_student_login/
│   ├── login.html      # Authentication page
│   └── signup.html
├── must_student_dashboard/
│   ├── index.html              # SPA shell
│   ├── dashboard.css           # Unified styles
│   ├── dashboard_view.html     # Book catalog fragment
│   ├── profile_view.html       # User library fragment
│   └── chatbot_view.html       # AI assistant fragment
└── must_book_details_page/
    └── index.html              # Book detail page
```

**Design Patterns:**
- **Single Page Application (SPA)**: Dynamically loads view fragments
- **Component-based**: Each view is a reusable HTML fragment
- **CSS Variables**: Theming with custom properties
- **Fetch API**: All backend communication

---

## Code Style Guide

### JavaScript

```javascript
// Use async/await for asynchronous operations
async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Use const/let, not var
const API_BASE_URL = '/api';
let currentPage = 1;

// Arrow functions for callbacks
books.map(book => book.title);

// Destructuring
const { student_id, student_name } = data.student;
```

### SQL

```sql
-- Use prepared statements (parameterized queries)
const query = 'SELECT * FROM books WHERE id = ?';
db.query(query, [bookId], callback);

-- NOT:
const query = `SELECT * FROM books WHERE id = ${bookId}`; // SQL injection risk!
```

### CSS

```css
/* Use CSS custom properties for theming */
:root {
    --primary: #1a237e;
    --accent: #ffd700;
}

/* BEM naming convention recommended */
.book-item {}
.book-item__title {}
.book-item--featured {}
```

---

## API Development

### Creating New Endpoints

1. **Create route file** (if new feature)
   ```javascript
   // backend/routes/feature.js
   const express = require('express');
   const router = express.Router();
   const db = require('../config/db');
   
   router.get('/', (req, res) => {
       // Implementation
   });
   
   module.exports = router;
   ```

2. **Mount route in server.js**
   ```javascript
   const featureRoutes = require('./routes/feature');
   app.use('/api/feature', featureRoutes);
   ```

3. **Document in API.md**

### Error Handling Pattern

```javascript
router.post('/endpoint', (req, res) => {
    // Validate input
    const { required_field } = req.body;
    
    if (!required_field) {
        return res.status(400).json({
            success: false,
            message: 'Missing required field'
        });
    }
    
    // Database operation
    db.query(query, [params], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        res.json({
            success: true,
            data: results
        });
    });
});
```

---

## Database Development

### Creating Migrations

1. **Create SQL file** in `database/` folder
   ```sql
   -- 06_add_email_column.sql
   ALTER TABLE login_detail ADD COLUMN email VARCHAR(100);
   ```

2. **Run migration**
   ```bash
   mysql -u root -p library_system < database/06_add_email_column.sql
   ```

3. **Update schema documentation** in `DATABASE.md`

### Adding Indexes

```sql
-- For frequently queried columns
CREATE INDEX idx_column_name ON table_name(column_name);

-- For search functionality
CREATE FULLTEXT INDEX ft_search ON books(title, description);
```

---

## Frontend Development

### Adding New View Fragment

1. **Create HTML file**
   ```html
   <!-- front_end/must_student_dashboard/new_view.html -->
   <div class="view-section">
       <h1>New Feature</h1>
       <!-- Content -->
   </div>
   
   <script>
       // View-specific JavaScript
       function initializeNewView() {
           // Logic here
       }
       initializeNewView();
   </script>
   ```

2. **Add navigation link** in `index.html`
   ```html
   <a href="#" class="nav-link" onclick="loadView('new', this)">New Feature</a>
   ```

### Fetching Data from Backend

```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/endpoint');
        const data = await response.json();
        
        if (data.success) {
            displayData(data.items);
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showError('Connection error');
    }
}
```

---

## Testing

### Backend Testing

Create test files in `tests/` folder:

```javascript
// tests/test_books.js
const http = require('http');

async function testBooksAPI() {
    const response = await fetch('http://localhost:3000/api/books');
    const data = await response.json();
    
    if (data.success && data.books.length > 0) {
        console.log('✅ Books API working');
    } else {
        console.log('❌ Books API failed');
    }
}

testBooksAPI();
```

Run:
```bash
node tests/test_books.js
```

### Manual Testing Checklist

- [ ] Signup with new account
- [ ] Login with credentials
- [ ] Browse books
- [ ] Search functionality
- [ ] Borrow a book
- [ ] View borrowed books in profile
- [ ] Logout

---

## Debugging

### Backend Debugging

Add console logs:
```javascript
console.log('Request body:', req.body);
console.log('Query results:', results);
```

Use Node.js debugger:
```bash
node --inspect server.js
# Open chrome://inspect in Chrome
```

### Frontend Debugging

Browser DevTools:
- **Console**: Check for JavaScript errors
- **Network**: Inspect API requests/responses
- **Application**: View sessionStorage data
- **Elements**: Inspect DOM and CSS

Add breakpoints in Sources tab.

---

## Security Best Practices

### 1. Never Commit Secrets

```gitignore
# .gitignore
.env
*.log
node_modules/
```

### 2. Validate All Inputs

```javascript
// Backend validation
if (!/^MUST-\d{4}-\d{3}$/.test(student_id)) {
    return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
    });
}
```

### 3. Use Parameterized Queries

```javascript
// GOOD
db.query('SELECT * FROM books WHERE id = ?', [id]);

// BAD - SQL injection risk!
db.query(`SELECT * FROM books WHERE id = ${id}`);
```

### 4. Hash Passwords

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## Performance Optimization

### Database Queries

```javascript
// GOOD: Select only needed columns
SELECT id, title, author FROM books WHERE id = ?

// BAD: Select everything
SELECT * FROM books WHERE id = ?
```

### Frontend

```javascript
// Debounce search input
let searchTimeout;
function handleSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300); // Wait 300ms after user stops typing
}
```

---

## Contributing

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat: Add book reservation endpoint

Implemented POST /api/reservations to allow students
to reserve unavailable books.

Closes #42
```

---

## Environment Variables

### Development (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=library_system
PORT=3000
NODE_ENV=development
```

### Production

```env
DB_HOST=production-db-host
DB_USER=production_user
DB_PASSWORD=strong_production_password
DB_NAME=library_system
PORT=3000
NODE_ENV=production
SESSION_SECRET=random_secret_string
```

---

## Common Tasks

### Add a New Book

```sql
INSERT INTO books (title, author, description, shelf_location, topics)
VALUES (
    'New Book Title',
    'Author Name',
    'Book description',
    'Shelf 2C',
    'JavaScript, Web Development'
);
```

### Reset a Student Password

```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'newpassword123';
const hashedPassword = await bcrypt.hash(newPassword, 10);

// Update in database
UPDATE login_detail SET password = '<hashed_password>' 
WHERE student_id = 'MUST-2024-001';
```

### View Active Borrowings

```sql
SELECT 
    l.student_name,
    b.title,
    br.borrowed_date,
    br.due_date
FROM borrowings br
JOIN login_detail l ON br.student_id = l.student_id
JOIN books b ON br.book_id = b.id
WHERE br.status = 'active'
ORDER BY br.due_date;
```

---

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Future Enhancements

### High Priority
- [ ] Implement JWT authentication
- [ ] Add password reset functionality
- [ ] Email notifications for due dates
- [ ] Admin dashboard

### Medium Priority
- [ ] Book reviews and ratings
- [ ] Advanced search filters
- [ ] Export borrowing history
- [ ] Mobile app (React Native)

### Low Priority
- [ ] Reading recommendations
- [ ] Book discussion forums
- [ ] QR code for physical books

---

**Happy Coding! 💻**

Join us in building the best library management system for MUST!
