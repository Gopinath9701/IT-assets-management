const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.use(authenticate, authorize("AssetManager", "AssetInventory", "InventoryManager", "Admin"));
router.get("/", getInventory);

module.exports = router;
