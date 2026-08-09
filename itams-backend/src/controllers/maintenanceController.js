const { pool } = require("../config/db");

async function getMaintenanceRequests(req, res, next) {
  try {
    const { employeeId } = req.query;
    const query = employeeId
      ? "SELECT * FROM maintenance_requests WHERE employee_id = $1 ORDER BY id DESC"
      : "SELECT * FROM maintenance_requests ORDER BY id DESC";
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

    if (!employeeId || !issueCategory || !description || !priority) {
      return res.status(400).json({ success: false, message: "Please fill all fields." });
    }

    const { rows } = await pool.query("SELECT COUNT(*) as count FROM maintenance_requests");
    const count = Number(rows[0].count);
    const requestId = `MR${String(count + 1).padStart(3, "0")}`;

    await pool.query(
      `INSERT INTO maintenance_requests (request_id, employee_id, asset_id, issue_category, description, priority, report_date)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)`,
      [requestId, employeeId, assetId || null, issueCategory, description, priority]
    );

    res.status(201).json({ success: true, message: "Maintenance request submitted", requestId });
  } catch (err) {
    next(err);
  }
}

async function updateMaintenanceStatus(req, res, next) {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const result = await pool.query("UPDATE maintenance_requests SET status = $1 WHERE request_id = $2", [status, requestId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMaintenanceRequests, createMaintenanceRequest, updateMaintenanceStatus };
