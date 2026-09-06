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

// Every real hosting platform (Vercel, Render, Railway, etc.) sits behind a
// reverse proxy that adds an X-Forwarded-For header. Without telling Express
// to trust that proxy, express-rate-limit refuses to trust the header and
// throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on every rate-limited request —
// this never shows up locally since there's no proxy in front of dev.
app.set("trust proxy", 1);

// "".split(",") returns [""], not [] — without .filter(Boolean) an unset
// CLIENT_ORIGIN would leave allowedOrigins truthy with a single empty-string
// entry, so cors() would whitelist only "" instead of falling back to "*",
// silently rejecting every real request from an actual deployed frontend.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
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
