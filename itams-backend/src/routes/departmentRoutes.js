const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getDepartments, addDepartment, deleteDepartment } = require("../controllers/departmentController");

const router = express.Router();

router.use(authenticate, authorize("HR"));

router.get("/", getDepartments);
router.post("/", addDepartment);
router.delete("/:departmentId", deleteDepartment);

module.exports = router;
