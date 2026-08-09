const { pool } = require("../config/db");

// Matches AddAsset.js's own generator (AST + 3 random alphanumeric chars), but
// re-generates server-side and checks the database for a collision — the
// frontend's version is a display placeholder only, not guaranteed unique.
async function generateAssetId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let attempt = 0; attempt < 20; attempt++) {
    let suffix = "";
    for (let i = 0; i < 3; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const candidate = `AST${suffix}`;
    const { rows } = await pool.query("SELECT id FROM assets WHERE asset_id = $1", [candidate]);
    if (rows.length === 0) return candidate;
  }
  throw new Error("Could not generate a unique Asset ID, please try again");
}

// Sequential, e.g. AR001, AR002... matches AssetRequest.js / RequestApproval.js display format
async function generateRequestId() {
  const { rows } = await pool.query("SELECT COUNT(*) as count FROM asset_requests");
  const count = Number(rows[0].count);
  return `AR${String(count + 1).padStart(3, "0")}`;
}

// Sequential, e.g. ASG001, ASG002... matches AssetAssignment.js display format
async function generateAssignmentId() {
  const { rows } = await pool.query("SELECT COUNT(*) as count FROM asset_assignments");
  const count = Number(rows[0].count);
  return `ASG${String(count + 1).padStart(3, "0")}`;
}

module.exports = { generateAssetId, generateRequestId, generateAssignmentId };
