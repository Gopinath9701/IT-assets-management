const { pool } = require("../config/db");
const { DEPARTMENT_NAME_REGEX } = require("../utils/validators");

async function getDepartments(req, res, next) {
  try {
    const { search = "" } = req.query;
    const { rows } = await pool.query(
      "SELECT * FROM departments WHERE name ILIKE $1 ORDER BY id ASC",
      [`%${search}%`]
    );
    res.json({ success: true, departments: rows });
  } catch (err) {
    next(err);
  }
}

async function addDepartment(req, res, next) {
  try {
    const { departmentId, departmentName, departmentHead, employeeCount } = req.body;

    if (!departmentId || !departmentName || !departmentHead || employeeCount === undefined) {
      return res.status(400).json({ success: false, message: "Please fill all fields." });
    }
    if (!DEPARTMENT_NAME_REGEX.test(departmentName)) {
      return res.status(400).json({ success: false, message: "Department Name must contain letters only." });
    }
    if (!DEPARTMENT_NAME_REGEX.test(departmentHead)) {
      return res.status(400).json({ success: false, message: "Department Head must contain letters only." });
    }

    await pool.query(
      "INSERT INTO departments (department_id, name, head, employee_count) VALUES ($1, $2, $3, $4)",
      [departmentId, departmentName, departmentHead, employeeCount]
    );

    res.status(201).json({ success: true, message: "Department added" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Department ID already exists" });
    }
    next(err);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const { departmentId } = req.params;
    const result = await pool.query("DELETE FROM departments WHERE department_id = $1", [departmentId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDepartments, addDepartment, deleteDepartment };
