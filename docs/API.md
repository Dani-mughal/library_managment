# API Documentation

Complete REST API reference for the MUST Library Management System.

**Base URL:** `http://localhost:3000/api`

---

## Authentication Endpoints

### POST /api/auth/signup

Create a new student account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "student_name": "John Doe",
  "student_id": "MUST-2024-001",
  "password": "securepassword123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "student_id": "MUST-2024-001"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Student ID already exists"
}
```

**Validation Rules:**
- `student_name`: Required, string
- `student_id`: Required,unique, format `MUST-YYYY-XXX`
- `password`: Required, minimum 6 characters

---

### POST /api/auth/login

Authenticate a student.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "student_id": "MUST-2024-001",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "student_id": "MUST-2024-001",
  "student_name": "John Doe"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Security:**
- Password is hashed using bcrypt (10 rounds)
- Plain password never stored in database
- Session data stored in browser sessionStorage

---

## Book Catalog Endpoints

### GET /api/books

Retrieve all books in the library.

**Request:**
```http
GET /api/books
```

**Response (Success - 200):**
```json
{
  "success": true,
  "books": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "department": "Software Engineering",
      "description": "A handbook of agile software craftsmanship...",
      "cover_color": "linear-gradient(135deg, #1e3c72, #2a5298)",
      "image_url": "/images/books/clean_code.png",
      "shelf_location": "Shelf 1A",
      "total_copies": 5,
      "available_copies": 3,
      "topics": "Clean Code, Best Practices, Refactoring",
      "created_at": "2026-02-01T19:57:45.000Z",
      "updated_at": "2026-02-01T19:57:45.000Z"
    },
    // ... more books
  ]
}
```

**Response Fields:**
- `id` - Unique book identifier
- `title` - Book title
- `author` - Book author
- `department` - Department category
- `description` - Book description/summary
- `cover_color` - CSS gradient for book cover (fallback)
- `image_url` - Path to book cover image (if available)
- `shelf_location` - Physical location in library
- `total_copies` - Total number of copies
- `available_copies` - Currently available copies
- `topics` - Comma-separated topics/keywords
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

---

### GET /api/books/:id

Retrieve a specific book by ID.

**Request:**
```http
GET /api/books/1
```

**Response (Success - 200):**
```json
{
  "success": true,
  "book": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "department": "Software Engineering",
    "description": "A handbook of agile software craftsmanship...",
    "cover_color": "linear-gradient(135deg, #1e3c72, #2a5298)",
    "image_url": "/images/books/clean_code.png",
    "shelf_location": "Shelf 1A",
    "total_copies": 5,
    "available_copies": 3,
    "topics": "Clean Code, Best Practices, Refactoring"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Book not found"
}
```

---

## Borrowing Endpoints

### GET /api/borrowings/:student_id

Get all borrowings for a specific student.

**Request:**
```http
GET /api/borrowings/MUST-2024-001
```

**Response (Success - 200):**
```json
{
  "success": true,
  "borrowings": [
    {
      "borrowing_id": 1,
      "borrowed_date": "2026-02-01T20:00:00.000Z",
      "due_date": "2026-02-15",
      "returned_date": null,
      "status": "active",
      "book_id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "image_url": "/images/books/clean_code.png",
      "cover_color": "linear-gradient(135deg, #1e3c72, #2a5298)",
      "department": "Software Engineering"
    },
    // ... more borrowings
  ]
}
```

**Response Fields:**
- `borrowing_id` - Unique borrowing record ID
- `borrowed_date` - When book was borrowed
- `due_date` - When book is due (14 days from borrow)
- `returned_date` - When book was returned (null if active)
- `status` - `active`, `returned`, or `overdue`
- `book_id` - Reference to book
- `title`, `author`, `image_url`, etc. - Book details (joined)

---

### POST /api/borrowings

Borrow a book.

**Request:**
```http
POST /api/borrowings
Content-Type: application/json

{
  "student_id": "MUST-2024-001",
  "book_id": 1
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "borrowing_id": 5,
  "due_date": "2026-02-15"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Book not available"
}
```

**Business Logic:**
1. Validates book exists and is available (`available_copies > 0`)
2. Creates borrowing record with `status = 'active'`
3. Calculates `due_date` as current date + 14 days
4. Decrements `available_copies` in books table
5. Returns borrowing details

**Validation Rules:**
- Book must exist
- Book must have available copies
- Student must exist in `login_detail` table

---

### PUT /api/borrowings/:id/return

Return a borrowed book.

**Request:**
```http
PUT /api/borrowings/5/return
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "returned_date": "2026-02-10"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Active borrowing not found"
}
```

**Business Logic:**
1. Finds active borrowing by ID
2. Updates `status` to `'returned'`
3. Sets `returned_date` to current date
4. Increments `available_copies` in books table

---

## Error Responses

All endpoints follow a consistent error format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Database error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider adding:
- Express rate limiting middleware
- IP-based throttling
- Per-user request limits

---

## CORS Configuration

CORS is enabled for all origins in development:
```javascript
app.use(cors());
```

For production, restrict to specific domains:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Example Usage

### JavaScript (Fetch API)

**Login Example:**
```javascript
async function login(studentId, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: studentId,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      sessionStorage.setItem('student_id', data.student_id);
      sessionStorage.setItem('student_name', data.student_name);
      window.location.href = '/must_student_dashboard/index.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}
```

**Borrow Book Example:**
```javascript
async function borrowBook(bookId) {
  const studentId = sessionStorage.getItem('student_id');
  
  const response = await fetch('http://localhost:3000/api/borrowings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      student_id: studentId,
      book_id: bookId
    })
  });
  
  const data = await response.json();
  alert(data.message);
}
```

---

## Database Schema

See [DATABASE.md](./DATABASE.md) for complete schema documentation.

---

## Testing the API

### Using curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"student_id":"MUST-2024-555","password":"test123"}'
```

**Get Books:**
```bash
curl http://localhost:3000/api/books
```

**Borrow Book:**
```bash
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{"student_id":"MUST-2024-555","book_id":1}'
```

### Using Postman

Import the following collection or test manually:
1. Create new request
2. Set method and URL
3. Add headers: `Content-Type: application/json`
4. Add body (for POST/PUT)
5. Send request

---

## API Versioning

Current version: `v1` (implicit, no versioning in URL)

For future versions, consider:
- `/api/v1/books`
- `/api/v2/books`

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Implement JWT tokens** instead of session storage
3. **Add request validation** with libraries like `express-validator`
4. **Sanitize all inputs** to prevent SQL injection
5. **Add rate limiting** to prevent abuse
6. **Log all authentication attempts**
7. **Implement CSRF protection**

---

## Future API Enhancements

- [ ] Pagination for `/api/books` (e.g., `?page=1&limit=10`)
- [ ] Search/filter parameters (e.g., `?search=python&department=SE`)
- [ ] JWT authentication tokens
- [ ] Refresh token endpoint
- [ ] Password reset endpoint
- [ ] Book reservation endpoint
- [ ] Borrowing history endpoint
- [ ] Admin endpoints (CRUD for books, users)

---

**API Version:** 1.0.0  
**Last Updated:** February 2026
