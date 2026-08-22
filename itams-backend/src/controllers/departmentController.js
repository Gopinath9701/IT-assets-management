const { generateDepartmentId } = require("../utils/idGenerator");
const { pool } = require("../config/db");
const { validateDepartmentPayload } = require("../utils/validators");

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
    const { departmentName, departmentHead, employeeCount } = req.body;

    const validationError = validateDepartmentPayload({ departmentName, departmentHead, employeeCount });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const departmentId = await generateDepartmentId();

    await pool.query(
      "INSERT INTO departments (department_id, name, head, employee_count) VALUES ($1, $2, $3, $4)",
      [departmentId, departmentName, departmentHead, employeeCount]
    );

    res.status(201).json({ success: true, message: "Department added", departmentId });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Department already exists" });
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
