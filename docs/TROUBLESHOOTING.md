# Troubleshooting Guide

Common issues and their solutions for the MUST Library Management System.

---

## Installation Issues

### MySQL Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'`

**Solutions:**

1. **Check Password:**
   ```bash
   mysql -u root -p
   # Enter password when prompted
   ```

2. **Reset MySQL Root Password:**
   ```bash
   # Stop MySQL
   sudo systemctl stop mysql
   
   # Start in safe mode
   sudo mysqld_safe --skip-grant-tables &
   
   # Login without password
   mysql -u root
   
   # Reset password
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   EXIT;
   
   # Restart MySQL normally
   sudo systemctl restart mysql
   ```

3. **Update `.env` file:**
   ```env
   DB_PASSWORD=your_correct_password
   ```

---

### Port 3000 Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**

**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use a different port in .env
PORT=3001
```

---

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solutions:**

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

If still failing:
```bash
npm cache clean --force
npm install
```

---

## Frontend Issues

### Books Not Displaying

**Symptom:** Dashboard shows "Loading library catalog..." indefinitely

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   # Should show "Server running on: http://localhost:3000"
   ```

2. **Check Browser Console:**
   - Press F12
   - Look for errors in Console tab
   - Common issue: CORS error or fetch failed

3. **Test API Directly:**
   ```bash
   # In browser, visit:
   http://localhost:3000/api/books
   
   # Should return JSON with books array
   ```

4. **Clear Browser Cache:**
   - Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload page (Ctrl+F5)

---

### Images Not Loading

**Symptom:** Book covers show broken image icon

**Solutions:**

1. **Check Image Files Exist:**
   ```bash
   ls front_end/images/books/
   # Should show .png files
   ```

2. **Verify Image Paths in Database:**
   ```sql
   USE library_system;
   SELECT title, image_url FROM books LIMIT 10;
   ```

3. **Check File Permissions:**
   ```bash
   chmod 644 front_end/images/books/*.png
   ```

4. **Serve Static Files:**
   Ensure `server.js` has:
   ```javascript
   app.use(express.static(path.join(__dirname, '../front_end')));
   ```

---

### Login Redirects to Wrong Page

**Symptom:** After login, redirected to landing page instead of dashboard

**Solution:**

Check `login.html` around line 175:
```javascript
// Should be:
window.location.href = '/must_student_dashboard/index.html';

// NOT:
window.location.href = '/must_library_landing_page/landing.html';
```

---

### Profile Page Stuck on "Loading..."

**Symptom:** "My Library" tab shows "Loading your borrowed books..." forever

**Solutions:**

1. **Check Console for Errors:**
   - Press F12, check Console tab

2. **Verify API Endpoint:**
   ```bash
   # Visit in browser (replace with your student ID):
   http://localhost:3000/api/borrowings/MUST-2024-555
   ```

3. **Check Session Storage:**
   - F12 → Application tab → Session Storage
   - Verify `student_id` exists

4. **Clear Session and Re-login:**
   ```javascript
   // In console:
   sessionStorage.clear();
   // Then login again
   ```

---

## Backend Issues

### Database Not Created

**Symptom:** `ER_BAD_DB_ERROR: Unknown database 'library_system'`

**Solution:**

```bash
mysql -u root -p
CREATE DATABASE library_system;
EXIT;

# Then run initialization scripts
mysql -u root -p library_system < database/01_create_database.sql
```

---

### Books Table Empty

**Symptom:** API returns `{"success": true, "books": []}`

**Solution:**

```bash
# Re-run books creation script
mysql -u root -p library_system < database/03_create_books_table.sql

# Verify:
mysql -u root -p -e "USE library_system; SELECT COUNT(*) FROM books;"
# Should return 50
```

---

### Foreign Key Constraint Error

**Error:** `Cannot add or update a child row: a foreign key constraint fails`

**Solution:**

Make sure parent records exist:

```sql
-- Check if student exists
SELECT * FROM login_detail WHERE student_id = 'MUST-2024-555';

-- If not, create account via signup page or:
INSERT INTO login_detail (student_id, student_name, password)
VALUES ('MUST-2024-555', 'Test User', '$2a$10$...');
```

---

### Server Crashes on Startup

**Symptom:** `server.js` exits immediately with error

**Solutions:**

1. **Check Logs:**
   ```bash
   cd backend
   node server.js
   # Read error message carefully
   ```

2. **Common Causes:**
   - `.env` file missing or malformed
   - MySQL not running: `sudo systemctl start mysql`
   - Port already in use
   - Missing dependencies: `npm install`

3. **Debug Mode:**
   ```bash
   NODE_ENV=development node server.js
   ```

---

## Authentication Issues

### "Invalid Credentials" on Correct Password

**Causes:**

1. **Wrong Student ID Format**
   - Must be exact: `MUST-2024-555`
   - Case-sensitive

2. **Password Changed**
   - Use password reset (if implemented)
   - Or manually update:
     ```sql
     UPDATE login_detail
     SET password = '$2a$10$...'
     WHERE student_id = 'MUST-2024-555';
     ```

3. **Account Doesn't Exist**
   ```sql
   SELECT * FROM login_detail WHERE student_id = 'MUST-2024-555';
   ```

---

### Cannot Create Account

**Error:** "Student ID already exists"

**Solutions:**

1. **Check existing accounts:**
   ```sql
   SELECT student_id FROM login_detail;
   ```

2. **Use different Student ID**

3. **Delete old account (if yours):**
   ```sql
   DELETE FROM login_detail WHERE student_id = 'MUST-2024-555';
   ```

---

## Borrowing Issues

### Cannot Borrow Book

**Error:** "Book not available"

**Causes:**

1. **No available copies:**
   ```sql
   SELECT title, available_copies FROM books WHERE id = 1;
   ```

2. **Book doesn't exist:**
   ```sql
   SELECT * FROM books WHERE id = 999;
   ```

**Solution:**

Manually add copies:
```sql
UPDATE books SET available_copies = 5 WHERE id = 1;
```

---

### Borrowed Book Not Showing in Profile

**Solutions:**

1. **Check borrowing record exists:**
   ```sql
   SELECT * FROM borrowings WHERE student_id = 'MUST-2024-555';
   ```

2. **Check API response:**
   ```
   http://localhost:3000/api/borrowings/MUST-2024-555
   ```

3. **Verify session storage:**
   - F12 → Application → Session Storage
   - `student_id` must match borrowing record

---

## Performance Issues

### Slow Page Load

**Solutions:**

1. **Check Network Tab (F12):**
   - Look for slow requests
   - Large image sizes?

2. **Optimize Images:**
   ```bash
   # Compress images
   npm install -g imagemin-cli
   imagemin front_end/images/books/* --out-dir=front_end/images/books/
   ```

3. **Enable Caching:**
   - Add cache headers in Nginx (production)

4. **Database Optimization:**
   ```sql
   -- Add indexes
   CREATE INDEX idx_title ON books(title);
   CREATE INDEX idx_student ON borrowings(student_id);
   ```

---

### High Memory Usage

**Solutions:**

1. **Check PM2 metrics:**
   ```bash
   pm2 monit
   ```

2. **Restart Application:**
   ```bash
   pm2 restart library-system
   ```

3. **Limit Connections:**
   Edit `db.js`:
   ```javascript
   connectionLimit: 10  // Reduce if needed
   ```

---

## Browser-Specific Issues

### Works in Chrome, Not in Safari

**Common Causes:**
- Fetch API compatibility
- CSS Grid support
- JavaScript ES6 features

**Solutions:**
- Use Babel to transpile JavaScript
- Add CSS fallbacks
- Test in Safari regularly

---

### CORS Errors

**Error:** `Access to fetch... has been blocked by CORS policy`

**Solution:**

Check `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

For specific origins:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

---

## Testing & Debugging

### Enable Debug Logging

Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Test Database Connection

Create `test-db.js`:
```javascript
const db = require('./config/db');

db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('❌ Database error:', err);
  } else {
    console.log('✅ Database connected!');
  }
  process.exit(0);
});
```

Run:
```bash
node test-db.js
```

---

## Common Error Messages

### `ECONNREFUSED`

**Meaning:** Cannot connect to MySQL

**Solutions:**
- Start MySQL: `sudo systemctl start mysql`
- Check MySQL is running: `sudo systemctl status mysql`
- Verify host/port in `.env`

### `ERR_CONNECTION_REFUSED`

**Meaning:** Backend server not running

**Solution:**
```bash
cd backend
npm start
```

### `404 Not Found`

**Meaning:** Route doesn't exist

**Solutions:**
- Check URL spelling
- Verify route is registered in `server.js`
- Check file paths

---

## Getting Help

### Check Documentation
- [Installation Guide](./INSTALLATION.md)
- [API Documentation](./API.md)
- [User Guide](./USER_GUIDE.md)
- [Database Schema](./DATABASE.md)

### Debug Steps
1. Check browser console (F12)
2. Check server logs
3. Check MySQL logs
4. Test API endpoints directly
5. Verify environment variables

### Report a Bug

Include:
- **Error message** (full text)
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Browser and version**
- **Node.js version** (`node --version`)
- **MySQL version** (`mysql --version`)

---

## Reset Everything

If all else fails, fresh install:

```bash
# Backup data
mysqldump -u root -p library_system > backup.sql

# Drop database
mysql -u root -p -e "DROP DATABASE library_system;"

# Re-run all setup scripts
mysql -u root -p < database/01_create_database.sql
mysql -u root -p < database/02_create_users_table.sql
mysql -u root -p < database/03_create_books_table.sql
mysql -u root -p < database/05_borrowings_table.sql

# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

# Restart server
npm start
```

---

**Still Having Issues?**

Contact the development team with detailed error information!
