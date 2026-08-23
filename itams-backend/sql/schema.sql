-- ITAMS Database Schema (PostgreSQL / Neon)
-- Run this once against your Neon database before running sql/seed.js

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Login accounts. Per spec: ONLY HR, Asset Manager, and Inventory Manager get
-- logins — regular employees are managed records only (see `employees` table),
-- they do not log in. All three roles share the same 9-digit login_id format
-- (YYMMDD + 3-digit serial, based on when that account was created).
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login_id VARCHAR(9) NOT NULL UNIQUE,        -- 9 digits: YYMMDD + serial
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  department VARCHAR(100) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('HR','AssetManager','InventoryManager')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  department_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  head VARCHAR(150) DEFAULT NULL,
  employee_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HR-managed employee records. No login capability — see note on `users` above.
-- employee_id: 9 digits, YYMMDD (joining date) + 3-digit serial, generated
-- server-side (never trusted from the client).
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(9) NOT NULL UNIQUE,
  employee_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  joining_date DATE DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','On Leave','Inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- asset_id: [3-letter type prefix][3-digit sequence], e.g. MON001, KEY001.
-- Generated server-side using the same prefix map as the frontend, but backed
-- by a real database uniqueness check (the frontend's own localStorage-based
-- counter can't guarantee uniqueness across devices/sessions).
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_id VARCHAR(10) NOT NULL UNIQUE,
  asset_type VARCHAR(50) NOT NULL,
  brand VARCHAR(100) DEFAULT NULL,
  model VARCHAR(100) DEFAULT NULL,
  serial_number VARCHAR(100) DEFAULT NULL,
  location VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Not In Use' CHECK (status IN ('In Use','Not In Use','Under Maintenance','Retired')),
  assigned_to VARCHAR(9) DEFAULT NULL REFERENCES employees(employee_id) ON DELETE SET NULL,
  purchase_date DATE DEFAULT NULL,
  purchase_cost DECIMAL(10,2) DEFAULT NULL,
  warranty_expiry DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS asset_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(20) NOT NULL UNIQUE,
  employee_id VARCHAR(9) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL,
  purpose VARCHAR(500) NOT NULL,
  required_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
  rejection_reason VARCHAR(500) DEFAULT NULL,
  approval_date DATE DEFAULT NULL,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_assignments (
  id SERIAL PRIMARY KEY,
  assignment_id VARCHAR(20) NOT NULL UNIQUE,
  request_id VARCHAR(20) NOT NULL REFERENCES asset_requests(request_id) ON DELETE CASCADE,
  employee_id VARCHAR(9) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  asset_id VARCHAR(10) NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  assigned_date TIMESTAMP NOT NULL,
  returned_date TIMESTAMP DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Assigned' CHECK (status IN ('Assigned','Returned')),
  condition VARCHAR(20) DEFAULT NULL CHECK (condition IN ('Good','Damaged','Faulty')),
  remarks VARCHAR(250) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(20) NOT NULL UNIQUE,
  employee_id VARCHAR(9) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  asset_id VARCHAR(20) DEFAULT NULL,
  issue_category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High')),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Completed')),
  report_date TIMESTAMP NOT NULL,
  technician VARCHAR(150) DEFAULT NULL,
  repair_started_at TIMESTAMP DEFAULT NULL,
  completed_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_asset_requests_status ON asset_requests(status);
CREATE INDEX idx_asset_requests_employee ON asset_requests(employee_id);
