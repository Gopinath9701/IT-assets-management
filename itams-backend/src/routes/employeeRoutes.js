const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeDashboard,
  getEmployeeStats,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/:employeeId/dashboard", authenticate, authorize("HR", "Admin", "Employee"), getEmployeeDashboard);

router.use(authenticate, authorize("HR", "Admin"));

router.get("/", getEmployees);
router.get("/stats/summary", getEmployeeStats); // must come before /:employeeId
router.get("/:employeeId", getEmployeeById);
router.post("/", addEmployee);
router.put("/:employeeId", updateEmployee);
router.patch("/:employeeId/status", updateEmployeeStatus);
router.delete("/:employeeId", deleteEmployee);

module.exports = router;
