-- ITAMS Database Schema (PostgreSQL / Neon)
-- Run this once against your Neon database before running sql/seed.js

-- updated_at auto-refresh trigger (Postgres has no ON UPDATE CURRENT_TIMESTAMP
-- like MySQL — this function + a trigger per table replaces it)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login_id VARCHAR(20) NOT NULL UNIQUE,       -- e.g. HR001, AM001 (what's typed at Login page)
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
  department_id VARCHAR(20) NOT NULL UNIQUE,  -- e.g. DEP001
  name VARCHAR(150) NOT NULL,
  head VARCHAR(150) DEFAULT NULL,
  employee_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,    -- e.g. EMP001
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

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_id VARCHAR(10) NOT NULL UNIQUE,        -- 'AST' + 3 alphanumeric, e.g. AST7K2
  asset_name VARCHAR(100) NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  brand VARCHAR(100) DEFAULT NULL,
  model VARCHAR(100) DEFAULT NULL,
  serial_number VARCHAR(100) DEFAULT NULL,
  location VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Not In Use' CHECK (status IN ('In Use','Not In Use','Under Maintenance')),
  assigned_to VARCHAR(20) DEFAULT NULL REFERENCES employees(employee_id) ON DELETE SET NULL,
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
  request_id VARCHAR(20) NOT NULL UNIQUE,      -- e.g. AR001
  employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
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
  assignment_id VARCHAR(20) NOT NULL UNIQUE,   -- e.g. ASG001
  request_id VARCHAR(20) NOT NULL REFERENCES asset_requests(request_id) ON DELETE CASCADE,
  employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  asset_id VARCHAR(10) NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  returned_date DATE DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Assigned' CHECK (status IN ('Assigned','Returned')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(20) NOT NULL UNIQUE,     -- e.g. MR001
  employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  asset_id VARCHAR(20) DEFAULT NULL,
  issue_category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High')),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Completed')),
  report_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_asset_requests_status ON asset_requests(status);
CREATE INDEX idx_asset_requests_employee ON asset_requests(employee_id);
