const { pool } = require("../config/db");
const { generateAssetId } = require("../utils/idGenerator");
const { validateAssetPayload } = require("../utils/validators");

const ASSET_ID_REGEX = /^AST[A-Za-z0-9]{3}$/;


// ======================================================
// GET ALL ASSETS
// GET /api/assets?search=&type=
// ======================================================
async function getAssets(req, res, next) {
  try {
    const { search = "", type = "" } = req.query;

    const params = [`%${search}%`];

    let query = `
      SELECT *
      FROM assets
      WHERE asset_name ILIKE $1
    `;

    if (type && type !== "All Assets") {
      query += ` AND asset_type = $2`;
      params.push(type);
    }

    query += ` ORDER BY id DESC`;

    const { rows } = await pool.query(query, params);

    res.json({
      success: true,
      assets: rows
    });

  } catch (err) {
    next(err);
  }
}


// ======================================================
// GET ASSET BY ID
// GET /api/assets/:assetId
// ======================================================
async function getAssetById(req, res, next) {
  try {
    const { assetId } = req.params;

    const { rows } = await pool.query(
      `SELECT *
       FROM assets
       WHERE asset_id = $1`,
      [assetId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found"
      });
    }

    res.json({
      success: true,
      asset: rows[0]
    });

  } catch (err) {
    next(err);
  }
}


// ======================================================
// ADD ASSET
// POST /api/assets
// ======================================================
async function addAsset(req, res, next) {
  try {
    const {
      assetType,
      brand,
      model,
      purchaseCost,
      purchaseDate,
      warrantyExpiry,
      description,
      assetId: providedAssetId,
    } = req.body;

    const validationError = validateAssetPayload({
      assetType,
      brand,
      model,
      purchaseCost,
      purchaseDate,
      warrantyExpiry,
      description,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const assetId = providedAssetId || (await generateAssetId());

    await pool.query(
      `
      INSERT INTO assets
      (
        asset_id,
        asset_name,
        asset_type,
        brand,
        model,
        purchase_date,
        warranty_expiry,
        purchase_cost,
        description,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Not In Use')
      `,
      [
        assetId,
        assetId,
        assetType,
        brand.trim(),
        model.trim(),
        purchaseDate || null,
        warrantyExpiry || null,
        Number(purchaseCost),
        description.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Asset added successfully",
      assetId,
    });

  } catch (err) {
    console.error("Add Asset Error:", err);
    next(err);
  }
}


// ======================================================
// UPDATE ASSET
// PUT /api/assets/:assetId
// ======================================================
async function updateAsset(req, res, next) {
  try {
    const { assetId } = req.params;
    const {
      assetType,
      brand,
      model,
      purchaseCost,
      purchaseDate,
      warrantyExpiry,
      description,
    } = req.body;

    const validationError = validateAssetPayload({
      assetType,
      brand,
      model,
      purchaseCost,
      purchaseDate,
      warrantyExpiry,
      description,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await pool.query(
      `
      UPDATE assets
      SET
        asset_type = $1,
        brand = $2,
        model = $3,
        purchase_date = $4,
        warranty_expiry = $5,
        purchase_cost = $6,
        description = $7
      WHERE asset_id = $8
      `,
      [
        assetType,
        brand.trim(),
        model.trim(),
        purchaseDate || null,
        warrantyExpiry || null,
        Number(purchaseCost),
        description.trim(),
        assetId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.json({
      success: true,
      message: "Asset updated successfully",
    });

  } catch (err) {
    next(err);
  }
}


// ======================================================
// DELETE ASSET
// DELETE /api/assets/:assetId
// ======================================================
async function deleteAsset(req, res, next) {
  try {

    const { assetId } = req.params;


    const result = await pool.query(
      `
      DELETE FROM assets
      WHERE asset_id = $1
      `,
      [assetId]
    );


    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found"
      });
    }


    res.json({
      success: true,
      message: "Asset deleted"
    });

  } catch (err) {
    next(err);
  }
}


// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  getAssets,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
  ASSET_ID_REGEX
};