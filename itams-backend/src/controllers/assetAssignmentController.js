const { pool } = require("../config/db");
const { generateAssignmentId } = require("../utils/idGenerator");
const { validateAssignmentPayload } = require("../utils/validators");

// GET /api/asset-assignments/pending  — approved requests not yet assigned
async function getPending(req, res, next) {
  try {
    const { employeeId } = req.query;
    const params = [];
    let query = `
      SELECT r.request_id, r.employee_id, e.employee_name, e.department,
             r.asset_type, r.purpose, r.required_date, r.approval_date
      FROM asset_requests r
      JOIN employees e ON e.employee_id = r.employee_id
      WHERE r.status = 'Approved'
        AND NOT EXISTS (SELECT 1 FROM asset_assignments a WHERE a.request_id = r.request_id)
    `;
    if (employeeId) {
      params.push(employeeId);
      query += ` AND r.employee_id = $${params.length}`;
    }
    query += " ORDER BY r.approval_date ASC";

    const { rows } = await pool.query(query, params);
    res.json({ success: true, pending: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/asset-assignments/history
async function getHistory(req, res, next) {
  try {
    const { rows } = await pool.query(`
      SELECT a.assignment_id, a.request_id, a.employee_id, e.employee_name,
             ast.asset_type, CONCAT(ast.asset_name, ' (', ast.asset_id, ')') AS asset_name_id,
             a.assigned_date, a.status
      FROM asset_assignments a
      JOIN employees e ON e.employee_id = a.employee_id
      JOIN assets ast ON ast.asset_id = a.asset_id
      ORDER BY a.id DESC
    `);
    res.json({ success: true, history: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/asset-assignments/available-assets?type=Laptop
// Real picker to replace the free-text field in AssetAssignment.js — lists
// assets of the requested type that are currently unassigned.
async function getAvailableAssets(req, res, next) {
  try {
    const { type } = req.query;
    const params = ["Not In Use"];
    let query = "SELECT asset_id, asset_name, asset_type FROM assets WHERE status = $1";
    if (type) {
      params.push(type);
      query += ` AND asset_type = $${params.length}`;
    }
    query += " ORDER BY asset_name ASC";
    const { rows } = await pool.query(query, params);
    res.json({ success: true, assets: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/asset-assignments  { requestId, assetId }
async function assignAsset(req, res, next) {
  const client = await pool.connect();
  try {
    const { requestId, assetId, employeeId } = req.body;

    const validationError = validateAssignmentPayload({ requestId, assetId, employeeId });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const reqRows = await client.query(
      "SELECT * FROM asset_requests WHERE request_id = $1 AND status = 'Approved'",
      [requestId]
    );
    if (reqRows.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Request not found or not approved" });
    }
    const existing = await client.query("SELECT id FROM asset_assignments WHERE request_id = $1", [requestId]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "This request has already been assigned" });
    }

    const assetRows = await client.query(
      "SELECT * FROM assets WHERE asset_id = $1 AND status = 'Not In Use'",
      [assetId]
    );
    if (assetRows.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Asset not found or not available for assignment" });
    }

    const assignedEmployeeId = reqRows.rows[0].employee_id;
    const assignmentId = await generateAssignmentId();

    await client.query("BEGIN");
    await client.query(
      `INSERT INTO asset_assignments (assignment_id, request_id, employee_id, asset_id, assigned_date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
      [assignmentId, requestId, assignedEmployeeId, assetId]
    );
    await client.query(
      "UPDATE assets SET status = 'In Use', assigned_to = $1 WHERE asset_id = $2",
      [assignedEmployeeId, assetId]
    );
    await client.query("COMMIT");

    res.status(201).json({ success: true, message: "Asset assigned successfully", assignmentId });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

// POST /api/asset-assignments/reassign  { assignmentId, employeeId, assetId }
async function reassignAsset(req, res, next) {
  const client = await pool.connect();
  try {
    const { assignmentId, employeeId, assetId } = req.body;

    if (!assignmentId || !employeeId) {
      return res.status(400).json({ success: false, message: "assignmentId and employeeId are required" });
    }

    const assignmentResult = await client.query(
      "SELECT * FROM asset_assignments WHERE assignment_id = $1 AND status = 'Assigned'",
      [assignmentId]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Active assignment not found" });
    }

    const currentAssignment = assignmentResult.rows[0];
    const targetAssetId = assetId || currentAssignment.asset_id;

    const employeeResult = await client.query("SELECT employee_id FROM employees WHERE employee_id = $1", [employeeId]);
    if (employeeResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Employee does not exist" });
    }

    const assetResult = await client.query("SELECT * FROM assets WHERE asset_id = $1", [targetAssetId]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    if (targetAssetId !== currentAssignment.asset_id && assetResult.rows[0].status !== "Not In Use") {
      return res.status(400).json({ success: false, message: "Target asset is not available for assignment" });
    }

    await client.query("BEGIN");

    await client.query(
      "UPDATE asset_assignments SET returned_date = CURRENT_DATE, status = 'Returned' WHERE assignment_id = $1",
      [assignmentId]
    );

    await client.query("UPDATE assets SET status = 'Not In Use', assigned_to = NULL WHERE asset_id = $1", [currentAssignment.asset_id]);

    const newAssignmentId = await generateAssignmentId();
    await client.query(
      `INSERT INTO asset_assignments (assignment_id, request_id, employee_id, asset_id, assigned_date, status)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, 'Assigned')`,
      [newAssignmentId, currentAssignment.request_id, employeeId, targetAssetId]
    );

    await client.query(
      "UPDATE assets SET status = 'In Use', assigned_to = $1 WHERE asset_id = $2",
      [employeeId, targetAssetId]
    );

    await client.query("COMMIT");

    res.status(201).json({ success: true, message: "Asset reassigned successfully", assignmentId: newAssignmentId });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

module.exports = { getPending, getHistory, getAvailableAssets, assignAsset, reassignAsset };
