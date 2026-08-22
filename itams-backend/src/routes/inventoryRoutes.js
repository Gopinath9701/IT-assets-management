const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.use(authenticate, authorize("AssetManager", "InventoryManager"));
router.get("/", getInventory);

module.exports = router;
