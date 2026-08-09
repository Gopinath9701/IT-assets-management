const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.use(authenticate, authorize("AssetManager", "Admin"));
router.get("/", getInventory);

module.exports = router;
