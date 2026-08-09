const { pool } = require("../config/db");

// GET /api/inventory  — one row per asset type with stock counts, matching AssetInventory.js
async function getInventory(req, res, next) {
  try {
    const { rows } = await pool.query(`
      SELECT
        asset_type AS name,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Not In Use') AS available,
        COUNT(*) FILTER (WHERE status = 'In Use') AS assigned,
        COUNT(*) FILTER (WHERE status = 'Under Maintenance') AS maintenance
      FROM assets
      GROUP BY asset_type
      ORDER BY asset_type ASC
    `);

    const inventory = rows.map((r) => ({
      name: r.name,
      total: Number(r.total),
      available: Number(r.available) || 0,
      assigned: Number(r.assigned) || 0,
      maintenance: Number(r.maintenance) || 0,
      status: (Number(r.available) || 0) > 0 ? "Available" : "Out of Stock",
    }));

    res.json({ success: true, inventory });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInventory };
