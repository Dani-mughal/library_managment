# Installation Guide

Complete step-by-step installation guide for the MUST Library Management System.

---

## System Requirements

### Software Requirements
- **Node.js**: v14.0.0 or higher
- **MySQL**: v8.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Web Browser**: Chrome, Firefox, Edge, or Safari (latest versions)

### Hardware Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 500MB free space
- **Processor**: Any modern processor (2GHz+)

---

## Step 1: Install Prerequisites

### Install Node.js

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install MySQL

**Windows:**
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run installer and select "Server only" or "Full"
3. Set root password during installation
4. Complete the setup wizard

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

---

## Step 2: Download/Clone Project

### Option A: Download ZIP
1. Download the project ZIP file
2. Extract to your desired location (e.g., `C:\Users\my\Desktop\library_managment`)

### Option B: Git Clone
```bash
git clone <repository-url>
cd library_managment
```

---

## Step 3: Database Setup

### Create Database and Tables

1. **Open MySQL Command Line**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

2. **Run Database Scripts** (in order)

   **Option A: From MySQL prompt**
   ```sql
   SOURCE C:/Users/my/Desktop/library_managment/database/01_create_database.sql;
   SOURCE C:/Users/my/Desktop/library_managment/database/02_create_users_table.sql;
   SOURCE C:/Users/my/Desktop/library_managment/database/03_create_books_table.sql;
   SOURCE C:/Users/my/Desktop/library_managment/database/05_borrowings_table.sql;
   SOURCE C:/Users/my/Desktop/library_managment/database/04_update_book_images.sql;
   ```

   **Option B: From command line**
   ```bash
   mysql -u root -p < database/01_create_database.sql
   mysql -u root -p < database/02_create_users_table.sql
   mysql -u root -p < database/03_create_books_table.sql
   mysql -u root -p < database/05_borrowings_table.sql
   mysql -u root -p < database/04_update_book_images.sql
   ```

3. **Verify Database Setup**
   ```sql
   USE library_system;
   SHOW TABLES;
   -- Should show: login_detail, books, borrowings
   
   SELECT COUNT(*) FROM books;
   -- Should return: 50
   ```

---

## Step 4: Backend Configuration

### Navigate to Backend Directory
```bash
cd backend
```

### Create Environment File

1. **Create `.env` file** in the `backend` directory:
   ```bash
   # Windows
   copy .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

2. **Edit `.env` file** with your MySQL credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=library_system
   
   # Server Configuration
   PORT=3000
   ```

### Install Node.js Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL driver
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

---

## Step 5: Start the Server

```bash
npm start
```

**Expected Output:**
```
==================================================
🚀 MUST Library Management System - Backend Server
==================================================
📡 Server running on: http://localhost:3000
📚 API Base URL: http://localhost:3000/api
==================================================
Available Endpoints:
  POST http://localhost:3000/api/auth/signup
  POST http://localhost:3000/api/auth/login
==================================================
✅ Connected to MySQL database: library_system
```

---

## Step 6: Access the Application

### Open in Browser

1. **Landing Page:**
   ```
   http://localhost:3000
   ```

2. **Signup Page:**
   ```
   http://localhost:3000/must_student_login/signup.html
   ```

3. **Login Page:**
   ```
   http://localhost:3000/must_student_login/login.html
   ```

### Create Your Account

1. Navigate to signup page
2. Enter your details:
   - **Student Name**: Your full name
   - **Student ID**: Format `MUST-YYYY-XXX` (e.g., `MUST-2024-001`)
   - **Password**: Minimum 8 characters
3. Click "Create Account"
4. You'll be redirected to login

### Login and Explore

1. Enter your Student ID and Password
2. You'll be redirected to the **Student Dashboard**
3. Browse books, borrow, and manage your library account!

---

## Step 7: Verify Installation

### Run Test Scripts

1. **Backend API Test:**
   ```bash
   node tests/verify_backend.js
   ```
   
   Expected: ✅ All tests pass

2. **Borrowing System Test:**
   ```bash
   node tests/verify_borrowing.js
   ```
   
   Expected: ✅ All endpoints working

3. **Browser Tests:**
   - Open: `http://localhost:3000/tests/verify_ui.html`
   - Follow on-screen instructions

---

## Troubleshooting Installation

### Database Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
1. Verify MySQL credentials in `.env`
2. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```
3. If password is wrong, update `.env` file

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
1. **Option A:** Kill the process using port 3000
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill
   ```

2. **Option B:** Change port in `.env`
   ```env
   PORT=3001
   ```

### Module Not Found Error

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### Books Not Loading

**Solution:**
1. Check if database has books:
   ```sql
   USE library_system;
   SELECT COUNT(*) FROM books;
   ```
2. If count is 0, re-run: `03_create_books_table.sql`
3. Clear browser cache and reload

### Images Not Showing

**Solution:**
1. Verify images exist in:
   ```
   front_end/images/books/
   ```
2. Check file names match database `image_url`
3. Run: `04_update_book_images.sql`

---

## Post-Installation Configuration

### Optional: Set Up Auto-Start

**Windows (using PM2):**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name library-system
pm2 save
pm2 startup
```

**Linux (systemd service):**
Create `/etc/systemd/system/library-system.service`:
```ini
[Unit]
Description=MUST Library System
After=network.target mysql.service

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/library_managment/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable library-system
sudo systemctl start library-system
```

---

## Development Mode

### Run with Auto-Restart (Nodemon)

```bash
cd backend
npm install --save-dev nodemon
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Run:
```bash
npm run dev
```

---

## Next Steps

- ✅ Read the [User Guide](./USER_GUIDE.md) to learn how to use the system
- ✅ Check [API Documentation](./API.md) for backend integration
- ✅ Review [Database Schema](./DATABASE.md) to understand data structure
- ✅ See [Deployment Guide](./DEPLOYMENT.md) for production setup

---

**Installation Complete! 🎉**

You now have a fully functional library management system running locally.
