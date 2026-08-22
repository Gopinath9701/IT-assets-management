const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getPending,
  getHistory,
  getAvailableAssets,
  assignAsset,
  reassignAsset,
  returnAsset,
} = require("../controllers/assetAssignmentController");

const router = express.Router();

router.use(authenticate, authorize("AssetManager"));

router.get("/pending", getPending);
router.get("/history", getHistory);
router.get("/available-assets", getAvailableAssets);
router.post("/reassign", reassignAsset);
router.post("/:assignmentId/return", returnAsset);
router.post("/", assignAsset);

module.exports = router;
