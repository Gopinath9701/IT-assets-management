-- The UI has Technician / Repair Started / Completed Date & Time columns
-- with nothing behind them — status just flipped as a string with no record
-- of who worked it or when repair started/finished.
ALTER TABLE maintenance_requests ADD COLUMN technician VARCHAR(150) DEFAULT NULL;
ALTER TABLE maintenance_requests ADD COLUMN repair_started_at TIMESTAMP DEFAULT NULL;
ALTER TABLE maintenance_requests ADD COLUMN completed_at TIMESTAMP DEFAULT NULL;
