const { pool } = require("../config/db");
const { validateEmployeePayload, validateEmployeeEmail, validateEmployeeIdFormat } = require("../utils/validators");
const { generateEmployeeId } = require("../utils/idGenerator");

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

// GET /api/employees/:employeeId
async function getEmployeeById(req, res, next) {
  try {
    const { employeeId } = req.params;
    const idError = validateEmployeeIdFormat(employeeId);
    if (idError) {
      return res.status(400).json({ success: false, message: idError });
    }
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
// Employee ID is generated server-side from Date of Joining — never trusted
// from the client. No login account is created — per spec, only HR/Asset
// Manager/Inventory Manager accounts exist in `users`; employees don't log in.
async function addEmployee(req, res, next) {
  try {
    const { employeeName, email, department, designation, phone, joiningDate } = req.body;

    const validationError = validateEmployeePayload(
      { employeeName, department, designation, phone, joiningDate },
      { requireJoiningDate: true }
    );
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const employeeId = await generateEmployeeId(joiningDate);

    const emailError = validateEmployeeEmail(email, employeeId);
    if (emailError) {
      return res.status(400).json({ success: false, message: emailError });
    }

    await pool.query(
      `INSERT INTO employees (employee_id, employee_name, email, department, designation, phone, joining_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employeeId, employeeName, email, department, designation || null, phone || null, joiningDate]
    );

    res.status(201).json({ success: true, message: "Employee Added Successfully!", employeeId });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Employee ID or email already exists" });
    }
    next(err);
  }
}

// PUT /api/employees/:employeeId  (UpdateEmployee.js form — Employee ID is read-only)
async function updateEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { employeeName, email, department, designation, phone, joiningDate } = req.body;

    const validationError = validateEmployeePayload(
      { employeeName, department, designation, phone, joiningDate },
      { requireJoiningDate: false }
    );
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }
    if (email) {
      const emailError = validateEmployeeEmail(email, employeeId);
      if (emailError) {
        return res.status(400).json({ success: false, message: emailError });
      }
    }

    // COALESCE so any field the form doesn't send (e.g. email, per the current
    // UpdateEmployee.js) leaves the existing value untouched instead of wiping it.
    const result = await pool.query(
      `UPDATE employees SET
         employee_name = COALESCE($1, employee_name),
         email = COALESCE($2, email),
         department = COALESCE($3, department),
         designation = COALESCE($4, designation),
         phone = COALESCE($5, phone),
         joining_date = COALESCE($6, joining_date)
       WHERE employee_id = $7`,
      [employeeName || null, email || null, department || null, designation || null, phone || null, joiningDate || null, employeeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Employee Updated Successfully!" });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/employees/:employeeId/status
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

// GET /api/employees/stats/summary
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
  getEmployeeStats,
};
