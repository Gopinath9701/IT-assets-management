require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { testConnection } = require("./src/config/db");
const { verifyEmailTransport } = require("./src/utils/email");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
const assetRequestRoutes = require("./src/routes/assetRequestRoutes");
const assetAssignmentRoutes = require("./src/routes/assetAssignmentRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true, message: "ITAMS API is running" }));

app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/asset-requests", assetRequestRoutes);
app.use("/api/asset-assignments", assetAssignmentRoutes);
app.use("/api/inventory", inventoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await testConnection();
  app.listen(PORT, () => console.log(`🚀 ITAMS API listening on port ${PORT}`));
  verifyEmailTransport();
})();
