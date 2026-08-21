const { pool } = require("../config/db");
const { generateRequestId } = require("../utils/idGenerator");
const { validateAssetRequestPayload } = require("../utils/validators");

// GET /api/asset-requests?status=&employeeId=&assetType=
// Powers both AssetRequest.js (request history) and RequestApproval.js (pending queue)
async function getRequests(req, res, next) {
  try {
    const { status, employeeId, assetType } = req.query;
    const conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }
    if (employeeId) {
      params.push(employeeId);
      conditions.push(`r.employee_id = $${params.length}`);
    }
    if (assetType && assetType !== "All Assets") {
      params.push(assetType);
      conditions.push(`r.asset_type = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT r.*, e.employee_name, e.department
       FROM asset_requests r
       JOIN employees e ON e.employee_id = r.employee_id
       ${where}
       ORDER BY r.id DESC`,
      params
    );

    res.json({ success: true, requests: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/asset-requests  (AssetRequest.js form: employeeId, assetType, purpose, requiredDate)
async function createRequest(req, res, next) {
  try {
    const { employeeId, assetType, purpose, requiredDate } = req.body;

    const validationError = validateAssetRequestPayload({ employeeId, assetType, purpose, requiredDate });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { rows: empRows } = await pool.query("SELECT employee_id FROM employees WHERE employee_id = $1", [employeeId]);
    if (empRows.length === 0) {
      return res.status(400).json({ success: false, message: "Employee ID does not exist in the database" });
    }

    const requestId = await generateRequestId();

    await pool.query(
      `INSERT INTO asset_requests (request_id, employee_id, asset_type, purpose, required_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [requestId, employeeId, assetType, purpose.trim(), requiredDate]
    );

    res.status(201).json({ success: true, message: "Asset request submitted", requestId });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/asset-requests/:requestId/approve
async function approveRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    const result = await pool.query(
      `UPDATE asset_requests SET status = 'Approved', approval_date = CURRENT_DATE
       WHERE request_id = $1 AND status = 'Pending'`,
      [requestId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Pending request not found" });
    }
    res.json({ success: true, message: "Request approved" });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/asset-requests/:requestId/reject  { reason }
async function rejectRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: "Reason for Rejection is required" });
    }

    const result = await pool.query(
      `UPDATE asset_requests SET status = 'Rejected', rejection_reason = $1, approval_date = CURRENT_DATE
       WHERE request_id = $2 AND status = 'Pending'`,
      [reason.trim(), requestId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Pending request not found" });
    }
    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRequests, createRequest, approveRequest, rejectRequest };
