const pool = require('../config/db');

const User = {
  async create({ employeeName, employeeId, email, department, designation, phoneNumber, dateOfJoining, passwordHash }) {
    const [result] = await pool.query(
      `INSERT INTO users (employee_name, employee_id, email, department, designation, phone_number, date_of_joining, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeName, employeeId, email, department, designation, phoneNumber, dateOfJoining, passwordHash]
    );
    return result.insertId;
  },

  async findByEmailOrEmployeeId(identifier) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? OR employee_name = ? LIMIT 1`,
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  async findByEmployeeIdOrEmail(identifier) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? OR employee_id = ? LIMIT 1`,
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  async findByEmployeeIdAndDepartment(employeeId, department) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE employee_id = ? AND department = ? LIMIT 1`,
      [employeeId, department]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    return rows[0] || null;
  },

  async findByEmployeeId(employeeId) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE employee_id = ? LIMIT 1`, [employeeId]);
    return rows[0] || null;
  },

  async updatePassword(userId, passwordHash) {
    await pool.query(`UPDATE users SET password_hash = ? WHERE user_id = ?`, [passwordHash, userId]);
  },
};

module.exports = User;
