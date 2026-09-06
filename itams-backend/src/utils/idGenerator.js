// Fixed, distinct keys for pg_advisory_xact_lock — one per ID sequence.
// Every generate*Id() call must happen after acquiring the matching lock,
// inside the same transaction that performs the INSERT. The lock is held
// until COMMIT/ROLLBACK, so a second concurrent request generating an ID
// for the same entity type simply waits its turn instead of racing —
// it will see the first request's row once it proceeds, so it can never
// compute the same "next" ID. Without this, two requests hitting the same
// generator at the same instant can both read the same MAX/COUNT before
// either commits, both compute the identical ID, and the second one either
// fails on the UNIQUE constraint (ugly 500) or — for the old COUNT(*)-based
// generators — could silently collide with an ID freed up by a deletion.
const LOCK_KEYS = {
  employee: 187001,
  asset: 187002,
  department: 187003,
  request: 187004,
  assignment: 187005,
  maintenance: 187006,
};

async function acquireIdLock(client, entity) {
  await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_KEYS[entity]]);
}

// ---------------- EMPLOYEE ID ----------------
// Format: YYMMDD (from joining date) + 3-digit serial for that day, e.g. 260819001.
// Checked against BOTH employees.employee_id and users.login_id, since HR/Asset
// Manager/Inventory Manager accounts share this same numbering scheme.
async function generateEmployeeId(client, joiningDate) {
  const d = new Date(joiningDate);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const datePart = `${yy}${mm}${dd}`;

  const { rows } = await client.query(
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
  Laptop: "LAP",
  Desktop: "DSK",
  Monitor: "MON",
  Keyboard: "KEY",
  Webcam: "WEB",
  Projector: "PRO",
  Mouse: "MOU",
  CPU: "CPU",
  Printer: "PRI",
  Headset: "HEA",
  Scanner: "SCN",
};

async function generateAssetId(client, assetType) {
  const prefix = ASSET_TYPE_PREFIXES[assetType] || assetType.slice(0, 3).toUpperCase();

  const { rows } = await client.query(
    `SELECT MAX(CAST(SUBSTRING(asset_id FROM 4) AS INT)) AS max_seq
     FROM assets WHERE asset_id LIKE $1`,
    [`${prefix}%`]
  );

  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

// Sequential, e.g. AR001, AR002... MAX-based (not COUNT-based) so a deleted
// row can never free up a serial that a later request then reissues.
async function generateRequestId(client) {
  const { rows } = await client.query(
    `SELECT MAX(CAST(SUBSTRING(request_id FROM 3) AS INT)) AS max_seq
     FROM asset_requests WHERE request_id LIKE 'AR%'`
  );
  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `AR${String(nextSeq).padStart(3, "0")}`;
}

// Sequential, e.g. ASG001, ASG002... MAX-based, see generateRequestId note.
async function generateAssignmentId(client) {
  const { rows } = await client.query(
    `SELECT MAX(CAST(SUBSTRING(assignment_id FROM 4) AS INT)) AS max_seq
     FROM asset_assignments WHERE assignment_id LIKE 'ASG%'`
  );
  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `ASG${String(nextSeq).padStart(3, "0")}`;
}

// Sequential, e.g. MR001, MR002... MAX-based, see generateRequestId note.
async function generateMaintenanceRequestId(client) {
  const { rows } = await client.query(
    `SELECT MAX(CAST(SUBSTRING(request_id FROM 3) AS INT)) AS max_seq
     FROM maintenance_requests WHERE request_id LIKE 'MR%'`
  );
  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `MR${String(nextSeq).padStart(3, "0")}`;
}

// Sequential, e.g. DEP001, DEP002... generated server-side, never trusted from
// the client (same reasoning as employee/asset IDs).
async function generateDepartmentId(client) {
  const { rows } = await client.query(
    `SELECT MAX(CAST(SUBSTRING(department_id FROM 4) AS INT)) AS max_seq
     FROM departments WHERE department_id LIKE 'DEP%'`
  );
  const nextSeq = (Number(rows[0].max_seq) || 0) + 1;
  return `DEP${String(nextSeq).padStart(3, "0")}`;
}

module.exports = {
  acquireIdLock,
  generateEmployeeId,
  generateAssetId,
  generateRequestId,
  generateAssignmentId,
  generateMaintenanceRequestId,
  generateDepartmentId,
  ASSET_TYPE_PREFIXES,
};
