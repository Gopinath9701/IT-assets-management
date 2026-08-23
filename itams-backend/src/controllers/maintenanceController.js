const { pool } = require("../config/db");
const { validateMaintenancePayload } = require("../utils/validators");

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
  try {
    const { employeeId, assetId, issueCategory, description, priority } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    const validationError = validateMaintenancePayload({ issueCategory, description, priority });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { rows } = await pool.query("SELECT COUNT(*) as count FROM maintenance_requests");
    const count = Number(rows[0].count);
    const requestId = `MR${String(count + 1).padStart(3, "0")}`;

    await pool.query(
      `INSERT INTO maintenance_requests (request_id, employee_id, asset_id, issue_category, description, priority, report_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [requestId, employeeId, assetId || null, issueCategory, description, priority]
    );

    res.status(201).json({ success: true, message: "Maintenance request submitted", requestId });
  } catch (err) {
    next(err);
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
