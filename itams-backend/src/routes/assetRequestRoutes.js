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

router.get("/", authorize("HR", "AssetManager"), getRequests);
router.post("/", authorize("HR"), createRequest);
router.patch("/:requestId/approve", authorize("AssetManager"), approveRequest);
router.patch("/:requestId/reject", authorize("AssetManager"), rejectRequest);

module.exports = router;
