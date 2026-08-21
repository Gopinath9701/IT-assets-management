const jwt = require("jsonwebtoken");

function normalizeRole(role) {
  if (!role) return role;
  const aliases = {
    AssetInventory: "InventoryManager",
    InventoryManager: "AssetInventory",
  };

  return aliases[role] || role;
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    decoded.role = normalizeRole(decoded.role);
    req.user = decoded; // { id, loginId, role, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// usage: authorize('HR', 'Admin')
function authorize(...allowedRoles) {
  const allowed = new Set(
    allowedRoles.flatMap((role) => {
      const mapped = [role, normalizeRole(role)];
      return mapped.filter(Boolean);
    })
  );

  return (req, res, next) => {
    if (!req.user || !allowed.has(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied for your role" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
