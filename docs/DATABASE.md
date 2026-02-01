# Database Schema

Complete database structure documentation for the MUST Library Management System.

---

## Overview

The system uses **MySQL 8.0+** with a relational schema consisting of **3 main tables**:

1. **`login_detail`** - Student authentication
2. **`books`** - Library catalog
3. **`borrowings`** - Borrowing transactions

**Database Name:** `library_system`

---

## Entity Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  login_detail   │         │   borrowings     │         │     books       │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ student_id (PK) │◄────────│ student_id (FK)  │         │ id (PK)         │
│ student_name    │         │ book_id (FK)     │────────►│ title           │
│ password        │         │ id (PK)          │         │ author          │
│ created_at      │         │ borrowed_date    │         │ department      │
└─────────────────┘         │ due_date         │         │ description     │
                            │ returned_date    │         │ cover_color     │
                            │ status           │         │ image_url       │
                            └──────────────────┘         │ shelf_location  │
                                                         │ total_copies    │
                                                         │ available_copies│
                                                         │ topics          │
                                                         │ created_at      │
                                                         │ updated_at      │
                                                         └─────────────────┘
```

---

## Table: `login_detail`

**Purpose:** Store student accounts for authentication.

### Schema

```sql
CREATE TABLE login_detail (
    student_id VARCHAR(50) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `student_id` | VARCHAR(50) | PRIMARY KEY | Unique student identifier (format: MUST-YYYY-XXX) |
| `student_name` | VARCHAR(100) | NOT NULL | Full name of the student |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password (60 chars after hashing) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

### Indexes

- **PRIMARY KEY** on `student_id`

### Sample Data

```sql
INSERT INTO login_detail (student_id, student_name, password) VALUES
('MUST-2024-555', 'Ali Ahmed', '$2a$10$...'), -- test123
('TEST-001', 'Test User', '$2a$10$...'); -- test
```

### Notes

- Password stored as bcrypt hash (10 rounds)
- `student_id` format enforced on frontend
- No email field (can be added in future)

---

## Table: `books`

**Purpose:** Store library book catalog.

### Schema

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT 'Software Engineering',
    description TEXT,
    cover_color VARCHAR(50) DEFAULT 'linear-gradient(135deg, #1e3c72, #2a5298)',
    image_url VARCHAR(255),
    shelf_location VARCHAR(50),
    total_copies INT DEFAULT 5,
    available_copies INT DEFAULT 5,
    topics TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique book identifier |
| `title` | VARCHAR(255) | NOT NULL | Book title |
| `author` | VARCHAR(255) | NOT NULL | Book author |
| `department` | VARCHAR(100) | DEFAULT 'Software Engineering' | Department category |
| `description` | TEXT | NULL | Book description/summary |
| `cover_color` | VARCHAR(50) | DEFAULT gradient | CSS gradient for book cover (fallback) |
| `image_url` | VARCHAR(255) | NULL | Path to book cover image |
| `shelf_location` | VARCHAR(50) | NULL | Physical library location |
| `total_copies` | INT | DEFAULT 5 | Total number of copies owned |
| `available_copies` | INT | DEFAULT 5 | Currently available copies |
| `topics` | TEXT | NULL | Comma-separated keywords/topics |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Last modification time |

### Indexes

- **PRIMARY KEY** on `id`
- Future: Add index on `title` for faster search
- Future: Full-text index on `topics` and `description`

### Sample Data

```sql
-- Example book record
INSERT INTO books (title, author, description, image_url, shelf_location, topics) VALUES
('Clean Code', 'Robert C. Martin', 
 'A handbook of agile software craftsmanship...', 
 '/images/books/clean_code.png',
 'Shelf 1A',
 'Clean Code, Best Practices, Refactoring');
```

### Business Rules

- `available_copies` ≤ `total_copies` (enforced in application logic)
- `available_copies` decremented on borrow, incremented on return
- `image_url` is optional (NULL for books without covers)

---

## Table: `borrowings`

**Purpose:** Track book borrowing transactions.

### Schema

```sql
CREATE TABLE borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    book_id INT NOT NULL,
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    returned_date DATE NULL,
    status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES login_detail(student_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);
```

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique borrowing record ID |
| `student_id` | VARCHAR(50) | FOREIGN KEY, NOT NULL | Student who borrowed the book |
| `book_id` | INT | FOREIGN KEY, NOT NULL | Book that was borrowed |
| `borrowed_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When book was borrowed |
| `due_date` | DATE | NOT NULL | When book is due (14 days from borrow) |
| `returned_date` | DATE | NULL | When book was returned (NULL if active) |
| `status` | ENUM | DEFAULT 'active' | Current status: active/returned/overdue |

### Foreign Keys

- `student_id` → `login_detail(student_id)` ON DELETE CASCADE
- `book_id` → `books(id)` ON DELETE CASCADE

**CASCADE Behavior:**
- If a student account is deleted, all their borrowing records are deleted
- If a book is deleted, all borrowing records for that book are deleted

### Indexes

- **PRIMARY KEY** on `id`
- **INDEX** on `student_id` (for fast lookup by student)
- **INDEX** on `status` (for filtering active/overdue borrowings)

### Sample Data

```sql
INSERT INTO borrowings (student_id, book_id, due_date, status) VALUES
('MUST-2024-555', 1, '2026-02-15', 'active'),
('MUST-2024-555', 2, '2026-02-15', 'active'),
('TEST-001', 4, '2026-02-10', 'active');
```

### Business Logic

**Status Values:**
- `active` - Book is currently borrowed and not yet due
- `overdue` - Book is past due date (computed in application, not automatically)
- `returned` - Book has been returned

**Due Date Calculation:**
```javascript
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 14); // 14 days from borrow
```

**Return Flow:**
1. Update `status` to 'returned'
2. Set `returned_date` to current date
3. Increment `books.available_copies`

---

## Database Initialization Scripts

Execute in this order:

1. **`01_create_database.sql`** - Creates `library_system` database
2. **`02_create_users_table.sql`** - Creates `login_detail` table
3. **`03_create_books_table.sql`** - Creates `books` table with 50 sample books
4. **`05_borrowings_table.sql`** - Creates `borrowings` table
5. **`04_update_book_images.sql`** - Updates image URLs for books

---

## Relationships

### One-to-Many Relationships

- **Student → Borrowings**
  - One student can have multiple borrowing records
  - Accessed via: `SELECT * FROM borrowings WHERE student_id = ?`

- **Book → Borrowings**
  - One book can have multiple borrowing records
  - Accessed via: `SELECT * FROM borrowings WHERE book_id = ?`

---

## Query Examples

### Get All Books

```sql
SELECT * FROM books WHERE available_copies > 0;
```

### Get Book by ID

```sql
SELECT * FROM books WHERE id = 1;
```

### Get Student's Borrowings (with Book Details)

```sql
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
    bk.cover_color
FROM borrowings b
INNER JOIN books bk ON b.book_id = bk.id
WHERE b.student_id = 'MUST-2024-555'
ORDER BY b.borrowed_date DESC;
```

### Borrow a Book (Transaction)

```sql
START TRANSACTION;

-- Insert borrowing record
INSERT INTO borrowings (student_id, book_id, due_date)
VALUES ('MUST-2024-555', 1, '2026-02-15');

-- Decrement available copies
UPDATE books SET available_copies = available_copies - 1 WHERE id = 1;

COMMIT;
```

### Return a Book (Transaction)

```sql
START TRANSACTION;

-- Update borrowing status
UPDATE borrowings 
SET status = 'returned', returned_date = CURDATE()
WHERE id = 5;

-- Increment available copies
UPDATE books SET available_copies = available_copies + 1 
WHERE id = (SELECT book_id FROM borrowings WHERE id = 5);

COMMIT;
```

---

## Data Integrity

### Constraints

- **Primary Keys**: Ensure uniqueness
- **Foreign Keys**: Maintain referential integrity
- **NOT NULL**: Prevent missing critical data
- **DEFAULT values**: Provide sensible defaults
- **ENUM**: Limit status to valid values

### Application-Level Validation

- Password strength (frontend + backend)
- Student ID format validation
- Availability check before borrowing
- Prevent borrowing when `available_copies = 0`

---

## Backup & Recovery

### Backup Database

```bash
mysqldump -u root -p library_system > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u root -p library_system < backup_20260201.sql
```

---

## Performance Optimization

### Current Indexes

- Primary keys on all tables
- Foreign key indexes (auto-created by MySQL)
- Manual indexes on `student_id` and `status` in borrowings

### Future Optimizations

- Full-text index on `books.description` and `books.topics`
- Composite index on `(student_id, status)` in borrowings
- Partitioning for large borrowing history

---

## Database Statistics

**Current Data (as seeded):**
- Students: 2
- Books: 50
- Borrowings: 3 (sample data)

**Expected Growth:**
- Students: ~500-1000 per year
- Books: Stable (occasional additions)
- Borrowings: ~10,000-50,000 per year

---

## Migration Guide

### Adding New Columns

```sql
ALTER TABLE books ADD COLUMN isbn VARCHAR(20) AFTER author;
ALTER TABLE books ADD COLUMN publisher VARCHAR(100);
```

### Modifying Existing Columns

```sql
ALTER TABLE login_detail MODIFY student_name VARCHAR(150);
```

### Creating Indexes

```sql
CREATE INDEX idx_title ON books(title);
CREATE FULLTEXT INDEX ft_description ON books(description);
```

---

**Database Version:** 1.0  
**MySQL Version:** 8.0+  
**Last Updated:** February 2026
