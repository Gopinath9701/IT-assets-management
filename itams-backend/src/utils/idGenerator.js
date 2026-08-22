const { pool } = require("../config/db");

// ---------------- EMPLOYEE ID ----------------
// Format: YYMMDD (from joining date) + 3-digit serial for that day, e.g. 260819001.
// Checked against BOTH employees.employee_id and users.login_id, since HR/Asset
// Manager/Inventory Manager accounts share this same numbering scheme.
async function generateEmployeeId(joiningDate) {
  const d = new Date(joiningDate);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const datePart = `${yy}${mm}${dd}`;

  const { rows } = await pool.query(
    `SELECT MAX(serial) AS max_serial FROM (
       SELECT CAST(SUBSTRING(employee_id FROM 7 FOR 3) AS INT) AS serial
       FROM employees WHERE employee_id LIKE $1
       UNION ALL
       SELECT CAST(SUBSTRING(login_id FROM 7 FOR 3) AS INT) AS serial
       FROM users WHERE login_id LIKE $1
     ) combined`,
    [`${datePart}%`]
  );

  const nextSerial = (Number(rows[0].max_serial) || 0) + 1;
  return `${datePart}${String(nextSerial).padStart(3, "0")}`;
}

// ---------------- ASSET ID ----------------
// Format: [3-letter type prefix][3-digit sequence], e.g. MON001, KEY001.
// Prefix map matches the frontend's own table exactly.
const ASSET_TYPE_PREFIXES = {
  Monitor: "MON",
  Keyboard: "KEY",
  Webcam: "WEB",
  Projector: "PRO",
  Mouse: "MOU",
  CPU: "CPU",
  Printer: "PRI",
};

async function generateAssetId(assetType) {
  const prefix = ASSET_TYPE_PREFIXES[assetType] || assetType.slice(0, 3).toUpperCase();

  const { rows } = await pool.query(
    `SELECT MAX(CAST(SUBSTRING(asset_id FROM 4) AS INT)) AS max_seq
     FROM assets WHERE asset_id LIKE $1`,
    [`${prefix}%`]
  );

  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

// Sequential, e.g. AR001, AR002...
async function generateRequestId() {
  const { rows } = await pool.query("SELECT COUNT(*) as count FROM asset_requests");
  const count = Number(rows[0].count);
  return `AR${String(count + 1).padStart(3, "0")}`;
}

// Sequential, e.g. ASG001, ASG002...
async function generateAssignmentId() {
  const { rows } = await pool.query("SELECT COUNT(*) as count FROM asset_assignments");
  const count = Number(rows[0].count);
  return `ASG${String(count + 1).padStart(3, "0")}`;
}

module.exports = { generateEmployeeId, generateAssetId, generateRequestId, generateAssignmentId, ASSET_TYPE_PREFIXES };
