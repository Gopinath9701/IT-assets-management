-- report_date was DATE-only, so "Reported Date & Time" in the UI never had a
-- time component to show. Widen it to TIMESTAMP so createMaintenanceRequest
-- can record the actual moment a ticket was reported.
ALTER TABLE maintenance_requests ALTER COLUMN report_date TYPE TIMESTAMP USING report_date::timestamp;
