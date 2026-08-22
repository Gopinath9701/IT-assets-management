-- Adds asset retirement (PB-05/PB-19) and asset return (PB-13) support,
-- which schema.sql didn't have. Run once against Neon; also mirrored into
-- schema.sql so a fresh database matches.

ALTER TABLE assets DROP CONSTRAINT assets_status_check;
ALTER TABLE assets ADD CONSTRAINT assets_status_check
  CHECK (status IN ('In Use', 'Not In Use', 'Under Maintenance', 'Retired'));

ALTER TABLE asset_assignments ADD COLUMN condition VARCHAR(20) CHECK (condition IN ('Good', 'Damaged', 'Faulty'));
ALTER TABLE asset_assignments ADD COLUMN remarks VARCHAR(250);

-- asset_name hasn't been collected on the Add/Edit forms in a long time (see
-- the old comment on this column in schema.sql) — dropping it for real.
ALTER TABLE assets DROP COLUMN asset_name;
