const { pool } = require("../config/db");
const { validateEmployeePayload } = require("../utils/validators");

// GET /api/employees?search=
async function getEmployees(req, res, next) {
  try {
    const { search = "" } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM employees
       WHERE employee_id ILIKE $1 OR employee_name ILIKE $1 OR department ILIKE $1
       ORDER BY id DESC`,
      [`%${search}%`]
    );
    res.json({ success: true, employees: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/employees/:employeeId  (also returns assigned assets, for ViewEmployeeList popup)
async function getEmployeeById(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { rows } = await pool.query("SELECT * FROM employees WHERE employee_id = $1", [employeeId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const { rows: assets } = await pool.query(
      `SELECT a.asset_id, a.asset_type, aa.assigned_date
       FROM asset_assignments aa
       JOIN assets a ON a.asset_id = aa.asset_id
       WHERE aa.employee_id = $1 AND aa.returned_date IS NULL`,
      [employeeId]
    );

    res.json({ success: true, employee: rows[0], assets });
  } catch (err) {
    next(err);
  }
}

// POST /api/employees  (AddEmployee.js form)
async function addEmployee(req, res, next) {
  try {
    const { employeeId, employeeName, email, department, designation, phone, joiningDate } = req.body;

    const validationError = validateEmployeePayload({
      employeeId, employeeName, email, department, designation, phone, joiningDate,
    });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    await pool.query(
      `INSERT INTO employees (employee_id, employee_name, email, department, designation, phone, joining_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employeeId, employeeName, email, department, designation || null, phone || null, joiningDate || null]
    );

    res.status(201).json({ success: true, message: "Employee Added Successfully!" });
  } catch (err) {
    if (err.code === "23505") { // Postgres unique_violation
      return res.status(409).json({ success: false, message: "Employee ID or email already exists" });
    }
    next(err);
  }
}

// PUT /api/employees/:employeeId  (UpdateEmployee.js form)
async function updateEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { employeeName, email, department, designation, phone, joiningDate } = req.body;

    const validationError = validateEmployeePayload({
      employeeId, employeeName, email, department, designation, phone, joiningDate,
    });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const result = await pool.query(
      `UPDATE employees SET employee_name=$1, email=$2, department=$3, designation=$4, phone=$5, joining_date=$6
       WHERE employee_id = $7`,
      [employeeName, email, department, designation || null, phone || null, joiningDate || null, employeeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Employee Updated Successfully!" });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/employees/:employeeId/status  (EmployeeStatus.js dropdown)
async function updateEmployeeStatus(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;

    if (!["Active", "On Leave", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const result = await pool.query("UPDATE employees SET status = $1 WHERE employee_id = $2", [status, employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/employees/:employeeId
async function deleteEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    const result = await pool.query("DELETE FROM employees WHERE employee_id = $1", [employeeId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
}

// GET /api/employees/:employeeId/dashboard  (Employee dashboard support)
async function getEmployeeDashboard(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { rows: employeeRows } = await pool.query("SELECT * FROM employees WHERE employee_id = $1", [employeeId]);

    if (employeeRows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const { rows: assignedAssets } = await pool.query(
      `SELECT a.asset_id, a.asset_name, a.asset_type, aa.assigned_date
       FROM asset_assignments aa
       JOIN assets a ON a.asset_id = aa.asset_id
       WHERE aa.employee_id = $1 AND aa.status = 'Assigned'
       ORDER BY aa.assigned_date DESC`,
      [employeeId]
    );

    const { rows: assetRequests } = await pool.query(
      `SELECT request_id, asset_type, purpose, required_date, status
       FROM asset_requests
       WHERE employee_id = $1
       ORDER BY id DESC
       LIMIT 10`,
      [employeeId]
    );

    const { rows: maintenanceRequests } = await pool.query(
      `SELECT request_id, issue_category, description, priority, status, report_date
       FROM maintenance_requests
       WHERE employee_id = $1
       ORDER BY id DESC
       LIMIT 10`,
      [employeeId]
    );

    res.json({
      success: true,
      dashboard: {
        employee: employeeRows[0],
        assignedAssets,
        assetRequests,
        maintenanceRequests,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/employees/stats/summary  (powers HRManagement.js "Employee Status Overview")
async function getEmployeeStats(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'Active') AS active,
         COUNT(*) FILTER (WHERE status = 'On Leave') AS "onLeave",
         COUNT(*) FILTER (WHERE status = 'Inactive') AS inactive
       FROM employees`
    );
    const r = rows[0];
    res.json({
      success: true,
      stats: {
        activeEmployees: Number(r.active) || 0,
        onLeave: Number(r.onLeave) || 0,
        // "Resigned" isn't a status value in the current schema (only Active/On Leave/Inactive) —
        // reported as 0 for now. Add a 'Resigned' status value if HR needs to distinguish it
        // from 'Inactive' later.
        resigned: 0,
        inactive: Number(r.inactive) || 0,
        totalEmployees: Number(r.total) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeDashboard,
  getEmployeeStats,
};
