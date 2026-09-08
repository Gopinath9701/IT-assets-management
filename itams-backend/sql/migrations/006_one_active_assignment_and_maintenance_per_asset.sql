-- At most one active ('Assigned') assignment row per asset at a time.
-- Backs up the application-level row-lock in assignAsset/reassignAsset
-- (SELECT ... FOR UPDATE) with a hard DB constraint, so this invariant
-- holds even if some other code path — including stale/buggy code —
-- tries to bypass it.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_assignment_per_asset
  ON asset_assignments (asset_id)
  WHERE status = 'Assigned';

-- At most one open (Pending/In Progress) maintenance request per asset at
-- a time. asset_id is nullable (a report need not reference a tracked
-- asset), so NULLs are naturally excluded from this partial index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_open_maintenance_per_asset
  ON maintenance_requests (asset_id)
  WHERE status IN ('Pending', 'In Progress');
