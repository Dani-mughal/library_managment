# Admin Panel Documentation

This document provides an overview of the Library Management System's Admin Panel, including its functionality, routes, and usage instructions.

---

## Overview

The Admin Panel is a dedicated interface for library staff to manage the book catalog. It allows for full CRUD (Create, Read, Update, Delete) operations on books, ensuring the library's digital catalog is always up-to-date.

---

## Admin Panel Access

- **URL Path:** `http://localhost:3000/must_admin_panel/index.html`
- **Frontend Location:** `front_end/must_admin_panel/`

---

## Key Functionalities

### 1. Catalog Dashboard
A comprehensive table view showing all books in the database.
- **Fields Displayed:** ID, Book Cover, Title, Author, Department, and Stock Status.
- **Stock Indicators:**
    - `In Stock` (Green): Sufficient copies available.
    - `Low Stock` (Yellow): Fewer than 2 copies remaining.
    - `Out of Stock` (Red): No copies available for borrowing.

### 2. Adding a New Book
Click the **"Add New Book"** button in the top navigation bar to open the creation form.
- **Required Fields:** Title, Author, Department.
- **Optional Fields:** Description, Shelf Location, Total/Available Copies, Image URL, Cover Gradient, and Topics.

### 3. Editing Existing Books
Click the **Edit** (blue icon) button on any row in the book table.
- The form will pre-populate with the current book details.
- Modify any field and click **"Save Book"** to update the database.

### 4. Deleting Books
Click the **Delete** (red icon) button for a permanent removal of the book from the system.
- *Note:* A confirmation prompt is required to prevent accidental deletion.

### 5. Instant Catalog Search
Use the search bar at the top to filter the table in real-time by:
- Book Title
- Author Name
- Department

---

## Backend API Endpoints (Admin Specific)

All admin operations are handled through the `/api/admin` routes:

- `POST /api/admin/books` - Creates a new book entry.
- `PUT /api/admin/books/:id` - Updates an existing book by ID.
- `DELETE /api/admin/books/:id` - Permanently deletes a book record.

---

## Implementation Details

- **UI Consistency:** Styled using the same design system as the student dashboard for a seamless experience.
- **Safety Features:** Includes confirmation dialogs for deletion and form resets on cancellation.
- **Database Mapping:** Directly manages all 13 fields in the `books` SQL table.

---

**Last Updated:** March 2026
