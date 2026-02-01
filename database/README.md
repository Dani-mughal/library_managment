# Database Setup

## Prerequisites
- MySQL Server installed and running
- MySQL credentials: root / hjkl

## Setup Instructions

### 1. Create Database
Run the database creation script:
```bash
mysql -u root -phjkl < 01_create_database.sql
```

### 2. Create Tables
Run the table creation script:
```bash
mysql -u root -phjkl < 02_create_tables.sql
```

### 3. Verify Setup
Check that the database and table were created successfully:
```bash
mysql -u root -phjkl -e "USE library_system; SHOW TABLES;"
```

Expected output: `login_detail`

### 4. View Table Structure
```bash
mysql -u root -phjkl -e "USE library_system; DESCRIBE login_detail;"
```

## Table Schema

### login_detail
| Field         | Type         | Null | Key | Default           | Extra          |
|---------------|--------------|------|-----|-------------------|----------------|
| id            | INT          | NO   | PRI | NULL              | auto_increment |
| student_name  | VARCHAR(255) | NO   |     | NULL              |                |
| student_id    | VARCHAR(50)  | NO   | UNI | NULL              |                |
| password_hash | VARCHAR(255) | NO   |     | NULL              |                |
| created_at    | TIMESTAMP    | NO   |     | CURRENT_TIMESTAMP |                |
| updated_at    | TIMESTAMP    | NO   |     | CURRENT_TIMESTAMP | on update...   |

## Troubleshooting

### Access Denied
If you get an "Access Denied" error, verify MySQL is running and credentials are correct:
```bash
mysql -u root -phjkl -e "SELECT 'Connection successful!' AS Status;"
```

### Database Already Exists
The scripts use `IF NOT EXISTS`, so they're safe to run multiple times.
