const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeStats,
} = require("../controllers/employeeController");

const router = express.Router();

router.use(authenticate);

// Read: HR manages employees; AssetManager needs read-only visibility for the
// Employee Status view under Asset Management (no update capability there).
router.get("/", authorize("HR", "AssetManager"), getEmployees);
router.get("/stats/summary", authorize("HR"), getEmployeeStats); // must come before /:employeeId
router.get("/:employeeId", authorize("HR", "AssetManager"), getEmployeeById);

// Write: HR only.
router.post("/", authorize("HR"), addEmployee);
router.put("/:employeeId", authorize("HR"), updateEmployee);
router.patch("/:employeeId/status", authorize("HR"), updateEmployeeStatus);
router.delete("/:employeeId", authorize("HR"), deleteEmployee);

module.exports = router;
