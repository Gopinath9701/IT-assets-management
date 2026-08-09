const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

const router = express.Router();

router.use(authenticate);

// HR/Admin/AssetManager can view all; anyone authenticated can file/view their own
router.get("/", getMaintenanceRequests);
router.post("/", createMaintenanceRequest);
router.patch("/:requestId/status", authorize("AssetManager", "Admin", "Technician"), updateMaintenanceStatus);

module.exports = router;
