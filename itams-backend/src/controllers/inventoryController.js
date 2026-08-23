const { pool } = require("../config/db");
const { ASSET_TYPE_PREFIXES } = require("../utils/idGenerator");

// Each row here represents a whole asset TYPE (grouped with COUNT(*)), not
// one physical asset, so there's no real per-row "asset ID" — reusing the
// same 3-letter prefix real individual asset IDs are built from (LAP, MON,
// KEY, ...) gives the frontend something distinct from `name` to show in an
// "ID"-labeled column instead of duplicating the type name into it.
function typeCode(assetType) {
  return ASSET_TYPE_PREFIXES[assetType] || assetType.slice(0, 3).toUpperCase();
}

async function getInventory(req, res, next) {
  try {
    const { rows: typeRows } = await pool.query(`
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

    const { rows: modelRows } = await pool.query(`
      SELECT
        asset_type,
        model AS name,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Not In Use') AS available,
        COUNT(*) FILTER (WHERE status = 'In Use') AS assigned,
        COUNT(*) FILTER (WHERE status = 'Under Maintenance') AS maintenance
      FROM assets
      WHERE model IS NOT NULL AND model <> ''
      GROUP BY asset_type, model
      ORDER BY asset_type ASC, model ASC
    `);

    const toRow = (r, assetType) => {
      const available = Number(r.available) || 0;
      return {
        id: typeCode(assetType),
        name: r.name,
        assetType,
        total: Number(r.total),
        available,
        assigned: Number(r.assigned) || 0,
        maintenance: Number(r.maintenance) || 0,
        status: available > 0 ? "Available" : "Out of Stock",
      };
    };

    const detailsByType = {};
    for (const r of modelRows) {
      if (!detailsByType[r.asset_type]) detailsByType[r.asset_type] = [];
      detailsByType[r.asset_type].push(toRow(r, r.asset_type));
    }

    const inventory = typeRows.map((r) => {
      const row = toRow(r, r.name);
      const details = detailsByType[row.name];
      if (details && details.length > 0) row.details = details;
      return row;
    });

    res.json({ success: true, inventory });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInventory };
