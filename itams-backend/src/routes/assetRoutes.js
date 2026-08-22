const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getAssets, getAssetById, addAsset, updateAsset, deleteAsset } = require("../controllers/assetController");

const router = express.Router();

router.use(authenticate, authorize("AssetManager"));

router.get("/", getAssets);
router.get("/:assetId", getAssetById);
router.post("/", addAsset);
router.put("/:assetId", updateAsset);
router.delete("/:assetId", deleteAsset);

module.exports = router;
