-- Same issue as maintenance_requests.report_date (migration 002): DATE-only
-- columns meant assigned_date/returned_date could never carry a time, so
-- Dashboard's Recent Activity "Date & Time" column never had a time to show.
ALTER TABLE asset_assignments ALTER COLUMN assigned_date TYPE TIMESTAMP USING assigned_date::timestamp;
ALTER TABLE asset_assignments ALTER COLUMN returned_date TYPE TIMESTAMP USING returned_date::timestamp;
