# User Guide

Learn how to use the MUST Library Management System as a student.

---

## Getting Started

### Creating Your Account

1. **Navigate to Signup Page**
   - Open: `http://localhost:3000/must_student_login/signup.html`
   - Or click "Create Account" on the login page

2. **Fill in Your Details**
   - **Student Name**: Enter your full name (e.g., "John Doe")
   - **Student ID**: Use format `MUST-YYYY-XXX`
     - Example: `MUST-2024-001`
     - YYYY = Year of admission
     - XXX = Sequential number
   - **Password**: Minimum 8 characters (keep it secure!)

3. **Submit Registration**
   - Click "Create Account"
   - You'll be redirected to the login page

### Logging In

1. **Open Login Page**
   - `http://localhost:3000/must_student_login/login.html`

2. **Enter Credentials**
   - Student ID: Your registered ID
   - Password: Your password

3. **Click "Login"**
   - You'll be redirected to your dashboard

---

## Dashboard Overview

The dashboard is your central hub for all library activities.

### Navigation Bar

Located at the top, contains:
- **MUST Central Logo** - Click to refresh
- **Dashboard** - Browse available books
- **AI Assistant** - Get help from the AI chatbot
- **My Library** - View your borrowed books
- **Your Name** - Shows you're logged in
- **Logout** - End your session

### Dashboard Tab (Main View)

**Features:**
- **Search Bar** - Search for books by title, author, or topic
- **Book Grid** - Visual display of all available books
- **Book Cards** show:
  - Cover image (for selected titles)
  - Book title and author
  - Department tag
  - **Borrow button**

---

## Browsing Books

### Using the Search Bar

1. **Click on the search bar** at the top of the dashboard
2. **Start typing** - Results filter instantly
3. **Search works on:**
   - Book titles
   - Author names
   - Departments
   - Topics/keywords

**Example Searches:**
- "Python" - Shows all Python-related books
- "Martin" - Shows books by authors with "Martin" in their name
- "Clean" - Shows "Clean Code" and related titles

### Viewing Book Details

1. **Click on any book card**
2. **Detail page shows:**
   - Full book cover
   - Complete description
   - Author information
   - Topics covered
   - Shelf location (where to find it physically)
   - Availability status
   - Total and available copies

3. **Actions available:**
   - **Borrow This Book** button
   - **Back to Catalog** button

---

## Borrowing Books

### How to Borrow

**From Dashboard:**
1. Find the book you want
2. Click the **"Borrow"** button on the book card
3. Confirm the borrow action
4. You'll see a success message with the due date

**From Book Details Page:**
1. Click "Borrow This Book" button
2. Confirm borrowing
3. Book is added to your library

### Borrowing Rules

- ✅ **Loan Period**: 14 days from borrow date
- ✅ **Availability**: Only books with available copies can be borrowed
- ✅ **Due Date**: Automatically calculated
- ⚠️ **Overdue Books**: Tracked and shown in your profile

### After Borrowing

- Book's available copies decrease by 1
- Book appears in "My Library" tab
- Due date is shown in your profile
- You receive confirmation with due date

---

## My Library (Profile)

Access your personal library information.

### Profile Information

Shows:
- Your avatar icon
- Student name
- Student ID
- Email (placeholder)

### Currently Borrowed Books Table

**Columns:**
- **Book** - Cover image + title + department
- **Author** - Book author
- **Borrowed** - Date you borrowed the book
- **Due Date** - When you must return it
- **Status** - Current status badge

**Status Badges:**
- 🟦 **Active** (Blue) - Book is borrowed and not overdue
- 🟩 **Returned** (Green) - Book has been returned
- 🟥 **Overdue** (Red) - Book is past due date

### If You Have No Borrowed Books

You'll see:
> "You haven't borrowed any books yet. Visit the Dashboard to browse available books!"

---

## AI Assistant

Get help from the AI chatbot (coming soon).

**Planned Features:**
- Book recommendations
- Library policy questions
- Research assistance
- Topic explanations

---

## Tips for Best Experience

### Search Tips

1. **Use partial words**: "algo" will find "Algorithms"
2. **Search by topic**: "DevOps", "Python", "Machine Learning"
3. **Case doesn't matter**: "CLEAN CODE" = "clean code"

### Managing Your Account

1. **Remember your Student ID** - You'll need it to log in
2. **Keep password secure** - Don't share with others
3. **Check due dates regularly** - Avoid overdue books
4. **Return books on time** - Help others access materials

### Browser Recommendations

- **Best**: Google Chrome or Microsoft Edge
- **Good**: Firefox or Safari
- **Clear cache** if you experience issues
- **Enable JavaScript** (required for functionality)

---

## Common Actions

### How to Return a Book

Currently, book returns must be done physically at the library. The system will be updated when you return the book.

**Future Feature:** Online return button in "My Library"

### How to Reserve a Book

Not yet available. Coming in future update.

### How to See Book Availability

**From Dashboard:**
- Look at the book card (no indicator yet, but Borrow button won't work if unavailable)

**From Book Details:**
- Shows "Available Copies: X" under book information

### How to Logout

1. Click your name in the top-right corner
2. Click **"Logout"**
3. You'll be redirect to the login page
4. Your session is cleared

---

## Keyboard Shortcuts

- **Enter** in search bar - Executes search (currently auto-searches)
- **Esc** - (Future) Close modals/popups
- **Tab** - Navigate between form fields

---

## Mobile Usage

The system is responsive and works on mobile devices:

1. **Layout adjusts** for smaller screens
2. **Touch-friendly** buttons and cards
3. **Scroll** to see full book grid
4. **Tap** to borrow or view details

---

## Troubleshooting

### Can't Login

**"Invalid credentials":**
- Check your Student ID is correct (format: MUST-YYYY-XXX)
- Verify password (case-sensitive)
- If forgotten, contact library admin

### Books Not Loading

- Refresh the page (F5 or Ctrl+R)
- Check your internet connection
- Clear browser cache
- Try a different browser

### Borrow Button Not Working

Possible causes:
- Book has 0 available copies
- You're not logged in (shouldn't happen if on dashboard)
- Network error - try again

### Images Not Showing

- Not all books have cover images (only first 10)
- Check your connection
- Reload the page

---

## Privacy & Security

### Your Data

- **Passwords are encrypted** using bcrypt
- **Session data** stored in your browser only
- **No tracking** or analytics
- **Data stays local** to the MUST network

### Session Management

- **Auto-logout** when you close the browser
- **Manual logout** recommended on shared computers
- **Session expires** when you clear browser data

---

## Getting Help

### Library Staff

For physical book issues:
- Visit the library desk
- Ask about book availability
- Report damaged books

### Technical Support

For system issues:
- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Contact IT support
- Report bugs to the development team

---

## Upcoming Features

Stay tuned for:
- 📧 Email notifications for due dates
- 🔖 Book reservations
- ⭐ Book reviews and ratings
- 📊 Reading statistics
- 📥 Borrowing history export
- 📱 Mobile app

---

**Happy Reading! 📚**

Enjoy your access to the MUST Central Library collection!
