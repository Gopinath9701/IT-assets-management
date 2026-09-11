const { pool } = require("../config/db");
const { validateMaintenancePayload } = require("../utils/validators");
const { generateMaintenanceRequestId, acquireIdLock } = require("../utils/idGenerator");

// LEFT JOIN so a ticket with no linked asset (asset_id NULL) still comes
// back — asset_type is just null for it instead of dropping the row.
async function getMaintenanceRequests(req, res, next) {
  try {
    const { employeeId } = req.query;
    const query = employeeId
      ? `SELECT m.*, a.asset_type FROM maintenance_requests m
         LEFT JOIN assets a ON a.asset_id = m.asset_id
         WHERE m.employee_id = $1 ORDER BY m.id DESC`
      : `SELECT m.*, a.asset_type FROM maintenance_requests m
         LEFT JOIN assets a ON a.asset_id = m.asset_id
         ORDER BY m.id DESC`;
    const params = employeeId ? [employeeId] : [];
    const { rows } = await pool.query(query, params);
    res.json({ success: true, reports: rows });
  } catch (err) {
    next(err);
  }
}

async function createMaintenanceRequest(req, res, next) {
  const client = await pool.connect();
  try {
    const { employeeId, assetId, issueCategory, description, priority } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    const validationError = validateMaintenancePayload({ issueCategory, description, priority });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Lock held for the rest of this transaction so two concurrent
    // submissions can never compute the same requestId (see idGenerator.js).
    await client.query("BEGIN");
    await acquireIdLock(client, "maintenance");

    if (assetId) {
      // An employee can only report an issue on an asset that's actually
      // assigned to them, not any asset in the system - nothing enforced
      // this before, so any employeeId/assetId pair typed into the form
      // was accepted regardless of who the asset actually belonged to.
      const { rows: assetRows } = await client.query(
        `SELECT assigned_to FROM assets WHERE asset_id = $1`,
        [assetId]
      );
      if (assetRows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Asset not found." });
      }
      if (assetRows[0].assigned_to !== employeeId) {
        await client.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          message: "This asset is not currently assigned to this employee.",
        });
      }

      // An asset can only have one open (Pending/In Progress) ticket at a
      // time - idx_one_open_maintenance_per_asset (migration 006) enforces
      // this at the DB level regardless of what checks this app-level code
      // does, but checking here first gives a clear, specific message
      // instead of a generic one after the INSERT fails.
      const { rows: openForAsset } = await client.query(
        `SELECT request_id FROM maintenance_requests WHERE asset_id = $1 AND status IN ('Pending', 'In Progress')`,
        [assetId]
      );
      if (openForAsset.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: `This asset already has an open maintenance request (${openForAsset[0].request_id}).`,
        });
      }
    }

    const requestId = await generateMaintenanceRequestId(client);

    await client.query(
      `INSERT INTO maintenance_requests (request_id, employee_id, asset_id, issue_category, description, priority, report_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [requestId, employeeId, assetId || null, issueCategory, description, priority]
    );
    await client.query("COMMIT");

    res.status(201).json({ success: true, message: "Maintenance request submitted", requestId });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      // Distinguish which constraint actually fired - both share the same
      // Postgres error code, but mean very different things to the user.
      if (err.constraint === "idx_one_open_maintenance_per_asset") {
        return res.status(409).json({
          success: false,
          message: "This asset already has an open maintenance request.",
        });
      }
      return res.status(409).json({ success: false, message: "Request ID already exists, please try again" });
    }
    next(err);
  } finally {
    client.release();
  }
}

// PATCH /api/maintenance/:requestId/status  { status, technician? }
// repair_started_at / completed_at are set once, the first time status
// actually reaches that stage — re-sending the same status (or bouncing
// back to it) doesn't overwrite an already-recorded time.
async function updateMaintenanceStatus(req, res, next) {
  try {
    const { requestId } = req.params;
    const { status, technician } = req.body;

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    if (technician !== undefined && technician !== null && technician.length > 150) {
      return res.status(400).json({ success: false, message: "Technician name is too long." });
    }

    // $1::text casts avoid "inconsistent types deduced for parameter $1" —
    // Postgres can't otherwise unify the type it infers from `status = $1`
    // with the type it infers from `$1 = 'In Progress'` inside the CASEs.
    const result = await pool.query(
      `UPDATE maintenance_requests
       SET status = $1::text,
           technician = COALESCE($2, technician),
           repair_started_at = CASE WHEN $1::text = 'In Progress' AND repair_started_at IS NULL THEN NOW() ELSE repair_started_at END,
           completed_at = CASE WHEN $1::text = 'Completed' AND completed_at IS NULL THEN NOW() ELSE completed_at END
       WHERE request_id = $3`,
      [status, technician || null, requestId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMaintenanceRequests, createMaintenanceRequest, updateMaintenanceStatus };
