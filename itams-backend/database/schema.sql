-- ITAMS Database Schema — Sprint 1
-- Matches the EXACT fields used in Register.js and Login.js (coder-2 branch)

CREATE DATABASE IF NOT EXISTS itams;
USE itams;

-- Frontend sends: employeeName, employeeId, email, department, designation, phoneNumber, dateOfJoining, password, confirmPassword
-- (confirmPassword is checked on the frontend only, never stored)
CREATE TABLE IF NOT EXISTS users (
  user_id        INT AUTO_INCREMENT PRIMARY KEY,
  employee_name  VARCHAR(100)  NOT NULL,
  employee_id    VARCHAR(50)   NOT NULL UNIQUE,
  email          VARCHAR(100)  NOT NULL UNIQUE,
  department     ENUM('IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations') NOT NULL,
  designation    VARCHAR(100)  NOT NULL,
  phone_number   VARCHAR(20)   NOT NULL,
  date_of_joining DATE         NOT NULL,
  status         ENUM('Active', 'On Leave', 'Inactive') NOT NULL DEFAULT 'Active',
  password_hash  VARCHAR(255)  NOT NULL,
  role           ENUM('Admin', 'HR', 'Employee', 'Technician', 'Asset Manager') NOT NULL DEFAULT 'Employee',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  otp_hash    VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
