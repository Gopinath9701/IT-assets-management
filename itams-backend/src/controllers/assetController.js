const { pool } = require("../config/db");
const { generateAssetId } = require("../utils/idGenerator");

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
      warrantyExpiry,
      purchaseCost
    } = req.body;


    // ------------------------------------------
    // Validate Asset Type
    // ------------------------------------------
    if (!assetType) {
      return res.status(400).json({
        success: false,
        message: "Asset Type is required"
      });
    }


    // ------------------------------------------
    // Validate Brand
    // ------------------------------------------
    if (!brand || brand.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Brand is required"
      });
    }


    // ------------------------------------------
    // Validate Purchase Cost
    // ------------------------------------------
    if (
      purchaseCost === undefined ||
      purchaseCost === null ||
      Number(purchaseCost) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Purchase cost must be greater than 0"
      });
    }


    // ------------------------------------------
    // Generate Asset ID
    // ------------------------------------------
    const assetId = await generateAssetId();


    // ------------------------------------------
    // Insert into PostgreSQL
    // ------------------------------------------
    await pool.query(
      `
      INSERT INTO assets
      (
        asset_id,
        asset_name,
        asset_type,
        brand,
        warranty_expiry,
        purchase_cost
      )
      VALUES
      ($1, $2, $3, $4, $5, $6)
      `,
      [
        assetId,

        // Your database requires asset_name.
        // Since you don't want an Asset Name field,
        // store Asset ID here.
        assetId,

        assetType,
        brand.trim(),
        warrantyExpiry || null,
        Number(purchaseCost)
      ]
    );


    // ------------------------------------------
    // Send success response
    // ------------------------------------------
    res.status(201).json({
      success: true,
      message: "Asset added successfully",
      assetId: assetId
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
      purchaseDate,
      warrantyExpiry
    } = req.body;


    const result = await pool.query(
      `
      UPDATE assets
      SET
        asset_type = $1,
        purchase_date = $2,
        warranty_expiry = $3
      WHERE asset_id = $4
      `,
      [
        assetType,
        purchaseDate || null,
        warrantyExpiry || null,
        assetId
      ]
    );


    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found"
      });
    }


    res.json({
      success: true,
      message: "Asset updated successfully"
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