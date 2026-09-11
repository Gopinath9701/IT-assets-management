-- At most one Pending asset request per (employee, asset_type) at a time -
-- an employee doesn't need two pending requests for the same type of asset
-- (e.g. two pending Laptop requests). Different asset types can still have
-- their own pending requests concurrently.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_pending_request_per_employee_asset_type
  ON asset_requests (employee_id, asset_type)
  WHERE status = 'Pending';
