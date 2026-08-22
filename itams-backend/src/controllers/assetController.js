const { pool } = require("../config/db");
const { generateAssetId, ASSET_TYPE_PREFIXES } = require("../utils/idGenerator");
const { validateNewAssetPayload, validateAssetUpdatePayload, validateAssetIdFormat } = require("../utils/validators");

// GET /api/assets?search=&type=
async function getAssets(req, res, next) {
  try {
    const { search = "", type = "" } = req.query;
    const params = [`%${search}%`];
    let query = "SELECT * FROM assets WHERE (asset_type ILIKE $1 OR asset_id ILIKE $1)";
    if (type && type !== "All Assets") {
      query += " AND asset_type = $2";
      params.push(type);
    }
    query += " ORDER BY id DESC";
    const { rows } = await pool.query(query, params);
    res.json({ success: true, assets: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/assets/:assetId
async function getAssetById(req, res, next) {
  try {
    const { assetId } = req.params;
    const idError = validateAssetIdFormat(assetId);
    if (idError) {
      return res.status(400).json({ success: false, message: idError });
    }
    const { rows } = await pool.query("SELECT * FROM assets WHERE asset_id = $1", [assetId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, asset: rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/assets  (AddAsset.js: assetType, brand, model, purchaseDate, warrantyExpiry, purchaseCost, description)
// Asset ID generated server-side (type-prefix + sequence) — the frontend's own
// localStorage-based counter can't guarantee uniqueness across sessions/devices.
async function addAsset(req, res, next) {
  try {
    const { assetType, brand, model, purchaseDate, warrantyExpiry, purchaseCost, description } = req.body;

    const validationError = validateNewAssetPayload({ assetType, brand, model, purchaseCost, purchaseDate, warrantyExpiry, description });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const assetId = await generateAssetId(assetType);

    await pool.query(
      `INSERT INTO assets (asset_id, asset_type, brand, model, purchase_date, warranty_expiry, purchase_cost, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [assetId, assetType, brand || null, model || null, purchaseDate || null, warrantyExpiry || null, purchaseCost || null, description || null]
    );

    res.status(201).json({ success: true, message: "Asset added successfully", assetId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/assets/:assetId  (EditAsset.js: model, description, purchaseDate, warrantyExpiry — Asset Type is read-only)
async function updateAsset(req, res, next) {
  try {
    const { assetId } = req.params;
    const { model, description, purchaseDate, warrantyExpiry } = req.body;

    const idError = validateAssetIdFormat(assetId);
    if (idError) {
      return res.status(400).json({ success: false, message: idError });
    }
    const validationError = validateAssetUpdatePayload({ model, description, purchaseDate, warrantyExpiry });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const result = await pool.query(
      `UPDATE assets SET model = $1, description = $2, purchase_date = $3, warranty_expiry = $4
       WHERE asset_id = $5`,
      [model || null, description || null, purchaseDate || null, warrantyExpiry || null, assetId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, message: "Asset updated successfully" });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/assets/:assetId/retire
// Only from 'Not In Use' — an asset currently assigned or under maintenance
// must be returned/resolved first, so retiring it doesn't silently orphan
// an active assignment or maintenance ticket.
async function retireAsset(req, res, next) {
  try {
    const { assetId } = req.params;
    const idError = validateAssetIdFormat(assetId);
    if (idError) {
      return res.status(400).json({ success: false, message: idError });
    }

    const result = await pool.query(
      "UPDATE assets SET status = 'Retired' WHERE asset_id = $1 AND status = 'Not In Use'",
      [assetId]
    );
    if (result.rowCount === 0) {
      const { rows } = await pool.query("SELECT status FROM assets WHERE asset_id = $1", [assetId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Asset not found" });
      }
      return res.status(400).json({ success: false, message: `Asset must be Not In Use to retire (currently ${rows[0].status})` });
    }

    res.json({ success: true, message: "Asset retired" });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/assets/:assetId
async function deleteAsset(req, res, next) {
  try {
    const { assetId } = req.params;
    const result = await pool.query("DELETE FROM assets WHERE asset_id = $1", [assetId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, message: "Asset deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAssets, getAssetById, addAsset, updateAsset, retireAsset, deleteAsset, ASSET_TYPE_PREFIXES };
