const { pool } = require("../config/db");
const { generateAssetId } = require("../utils/idGenerator");

const ASSET_ID_REGEX = /^AST[A-Za-z0-9]{3}$/;

// GET /api/assets?search=&type=   (ManageAsset.js search)
async function getAssets(req, res, next) {
  try {
    const { search = "", type = "" } = req.query;
    const params = [`%${search}%`];
    let query = "SELECT * FROM assets WHERE asset_name ILIKE $1";
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

// GET /api/assets/:assetId  (AssetDetails.js popup)
async function getAssetById(req, res, next) {
  try {
    const { assetId } = req.params;
    const { rows } = await pool.query("SELECT * FROM assets WHERE asset_id = $1", [assetId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, asset: rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/assets  (AddAsset.js form: assetName, assetType, brand, warrantyExpiry, purchaseCost)
// Asset ID is generated server-side, not trusted from the client.
async function addAsset(req, res, next) {
  try {
    const { assetName, assetType, brand, warrantyExpiry, purchaseCost } = req.body;

    if (!assetName || assetName.trim().length < 2 || assetName.length > 100) {
      return res.status(400).json({ success: false, message: "Asset name must be 2-100 characters" });
    }
    if (!assetType) {
      return res.status(400).json({ success: false, message: "Asset Type is required" });
    }

    const assetId = await generateAssetId();

    await pool.query(
      `INSERT INTO assets (asset_id, asset_name, asset_type, brand, warranty_expiry, purchase_cost)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [assetId, assetName.trim(), assetType, brand || null, warrantyExpiry || null, purchaseCost || null]
    );

    res.status(201).json({ success: true, message: "Asset added successfully", assetId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/assets/:assetId  (EditAsset.js form: assetName, assetType, purchaseDate, warrantyExpiry)
async function updateAsset(req, res, next) {
  try {
    const { assetId } = req.params;
    const { assetName, assetType, purchaseDate, warrantyExpiry } = req.body;

    const result = await pool.query(
      `UPDATE assets SET asset_name = $1, asset_type = $2, purchase_date = $3, warranty_expiry = $4
       WHERE asset_id = $5`,
      [assetName, assetType, purchaseDate || null, warrantyExpiry || null, assetId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, message: "Asset updated successfully" });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/assets/:assetId  (ManageAsset.js delete confirmation modal)
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

module.exports = { getAssets, getAssetById, addAsset, updateAsset, deleteAsset, ASSET_ID_REGEX };
