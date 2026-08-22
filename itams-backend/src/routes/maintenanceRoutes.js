const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

const router = express.Router();

router.use(authenticate, authorize("HR", "AssetManager", "InventoryManager"));

router.get("/", getMaintenanceRequests);
router.post("/", createMaintenanceRequest);
router.patch("/:requestId/status", authorize("AssetManager"), updateMaintenanceStatus);

module.exports = router;
