const { pool } = require("../config/db");
const { generateRequestId, acquireIdLock } = require("../utils/idGenerator");
const { validatePurpose, validateRequiredDate, validateRejectionReason, ASSET_TYPES } = require("../utils/validators");

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

async function createRequest(req, res, next) {
  const client = await pool.connect();
  try {
    const { employeeId, assetType, purpose, requiredDate } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, field: "employeeId", message: "Employee ID is required" });
    }
    if (!assetType || !ASSET_TYPES.includes(assetType)) {
      return res.status(400).json({ success: false, field: "assetType", message: "Please select a valid Asset Type" });
    }
    const purposeError = validatePurpose(purpose);
    if (purposeError) {
      return res.status(400).json({ success: false, field: "purpose", message: purposeError });
    }

    const { rows: empRows } = await pool.query("SELECT employee_id FROM employees WHERE employee_id = $1", [employeeId]);
    if (empRows.length === 0) {
      return res.status(400).json({ success: false, field: "employeeId", message: "Employee ID does not exist in the database" });
    }

    const requiredDateError = validateRequiredDate(requiredDate);
    if (requiredDateError) {
      return res.status(400).json({ success: false, field: "requiredDate", message: requiredDateError });
    }

    // Lock held for the rest of this transaction so two concurrent
    // submissions can never compute the same requestId (see idGenerator.js).
    await client.query("BEGIN");
    await acquireIdLock(client, "request");

    // Don't let someone request an asset type they're already holding -
    // unless they've returned it (assigned_to cleared, so this simply
    // finds nothing) or it's out for repair (an open maintenance ticket
    // means they don't actually have a working one right now, so a new
    // request for the same type should still go through).
    const { rows: alreadyOwned } = await client.query(
      `SELECT a.asset_id FROM assets a
       WHERE a.assigned_to = $1 AND a.asset_type = $2
       AND NOT EXISTS (
         SELECT 1 FROM maintenance_requests m
         WHERE m.asset_id = a.asset_id AND m.status IN ('Pending', 'In Progress')
       )`,
      [employeeId, assetType]
    );
    if (alreadyOwned.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        field: "assetType",
        message: `You already have a ${assetType} assigned to you (${alreadyOwned[0].asset_id}).`,
      });
    }

    // One employee doesn't need two pending requests for the same asset
    // type - idx_one_pending_request_per_employee_asset_type (migration 008)
    // enforces this at the DB level regardless of what checks this
    // app-level code does, but checking here first gives a clear, specific
    // message instead of a generic one after the INSERT fails.
    const { rows: existingPending } = await client.query(
      `SELECT request_id FROM asset_requests WHERE employee_id = $1 AND asset_type = $2 AND status = 'Pending'`,
      [employeeId, assetType]
    );
    if (existingPending.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        field: "assetType",
        message: `You already have a pending request for ${assetType} (${existingPending[0].request_id}).`,
      });
    }

    const requestId = await generateRequestId(client);

    await client.query(
      `INSERT INTO asset_requests (request_id, employee_id, asset_type, purpose, required_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [requestId, employeeId, assetType, purpose.trim(), requiredDate]
    );
    await client.query("COMMIT");

    res.status(201).json({ success: true, message: "Asset request submitted", requestId });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      // Distinguish which constraint actually fired - both share the same
      // Postgres error code, but mean very different things to the user.
      if (err.constraint === "idx_one_pending_request_per_employee_asset_type") {
        return res.status(409).json({
          success: false,
          field: "assetType",
          message: `You already have a pending request for ${req.body.assetType}.`,
        });
      }
      return res.status(409).json({ success: false, message: "Request ID already exists, please try again" });
    }
    next(err);
  } finally {
    client.release();
  }
}

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

async function rejectRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const reasonError = validateRejectionReason(reason);
    if (reasonError) {
      return res.status(400).json({ success: false, message: reasonError });
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
