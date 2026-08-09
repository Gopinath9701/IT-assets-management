const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getRequests,
  createRequest,
  approveRequest,
  rejectRequest,
} = require("../controllers/assetRequestController");

const router = express.Router();

router.use(authenticate);

// AssetRequest.js lives under HR Management; RequestApproval.js under Asset Management —
// both HR and AssetManager need to read requests.
router.get("/", authorize("HR", "AssetManager", "Admin"), getRequests);
router.post("/", authorize("HR", "Admin"), createRequest);
router.patch("/:requestId/approve", authorize("AssetManager", "Admin"), approveRequest);
router.patch("/:requestId/reject", authorize("AssetManager", "Admin"), rejectRequest);

module.exports = router;
