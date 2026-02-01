-- Make sure we're using the correct database
USE library_system;

-- Create login_detail table
CREATE TABLE IF NOT EXISTS login_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Display confirmation and table structure
SELECT 'Table login_detail created successfully!' AS Status;
DESCRIBE login_detail;
