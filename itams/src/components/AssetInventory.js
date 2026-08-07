import React, { useState } from "react";
import "./AssetInventory.css";

const ALL_ASSETS = [
  { name: "Laptop",    total: 50, available: 18, assigned: 30, maintenance: 2, status: "Available"    },
  { name: "Monitor",   total: 30, available: 7,  assigned: 21, maintenance: 2, status: "Available"    },
  { name: "Printer",   total: 20, available: 5,  assigned: 13, maintenance: 2, status: "Available"    },
  { name: "Keyboard",  total: 10, available: 4,  assigned: 5,  maintenance: 1, status: "Available"    },
  { name: "Mouse",     total: 10, available: 4,  assigned: 5,  maintenance: 1, status: "Available"    },
  { name: "Scanner",   total: 5,  available: 0,  assigned: 4,  maintenance: 1, status: "Out of Stock" },
  { name: "Projector", total: 5,  available: 0,  assigned: 3,  maintenance: 2, status: "Out of Stock" },
];

const ASSET_FILTER_OPTIONS = [
  "All Assets (Complete Inventory)",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Laptop",
  "CPU",
];

// ── Minimal SVG pie chart ───────────────────────────────────
function PieChart({ slices, size = 160 }) {
  const r = size / 2;
  let cumulative = 0;
  const total = slices.reduce((s, sl) => s + sl.value, 0);

  const paths = slices.map((sl) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += sl.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const largeArc = sl.value / total > 0.5 ? 1 : 0;
    const x1 = r + r * 0.85 * Math.cos(startAngle);
    const y1 = r + r * 0.85 * Math.sin(startAngle);
    const x2 = r + r * 0.85 * Math.cos(endAngle);
    const y2 = r + r * 0.85 * Math.sin(endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const lx = r + r * 0.55 * Math.cos(midAngle);
    const ly = r + r * 0.55 * Math.sin(midAngle);
    const pct = Math.round((sl.value / total) * 1000) / 10;
    return { path: `M${r},${r} L${x1},${y1} A${r * 0.85},${r * 0.85} 0 ${largeArc} 1 ${x2},${y2} Z`, color: sl.color, lx, ly, pct };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.path} fill={p.color} stroke="#fff" strokeWidth="2" />
      ))}
      {paths.map((p, i) => (
        <text key={`t${i}`} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#fff" fontWeight="700">{p.pct}%</text>
      ))}
    </svg>
  );
}

const AssetInventory = ({ username = "username", onLogout, onBack }) => {
  const [selectedAsset, setSelectedAsset] = useState("All Assets (Complete Inventory)");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered =
    selectedAsset === "All Assets (Complete Inventory)"
      ? ALL_ASSETS
      : ALL_ASSETS.filter((a) => a.name === selectedAsset);

  const totalAssets      = filtered.reduce((s, a) => s + a.total, 0);
  const availableAssets  = filtered.reduce((s, a) => s + a.available, 0);
  const assignedAssets   = filtered.reduce((s, a) => s + a.assigned, 0);
  const maintenanceAssets= filtered.reduce((s, a) => s + a.maintenance, 0);
  const outOfStock       = filtered.filter((a) => a.status === "Out of Stock").length;

  // Overview pie slices
  const overviewSlices = [
    { label: `Available (${availableAssets})`,         value: availableAssets,   color: "#2563eb" },
    { label: `Assigned (${assignedAssets})`,           value: assignedAssets,    color: "#22c55e" },
    { label: `Under Maintenance (${maintenanceAssets})`,value: maintenanceAssets, color: "#a855f7" },
  ].filter(s => s.value > 0);

  // Category pie slices
  const categorySlices = [
    { label: "Laptop (50)",   value: 50, color: "#2563eb" },
    { label: "Monitor (30)",  value: 30, color: "#22c55e" },
    { label: "Printer (20)",  value: 20, color: "#f97316" },
    { label: "Keyboard (10)", value: 10, color: "#a855f7" },
    { label: "Others (10)",   value: 10, color: "#ef4444" },
  ];

  const statusColor = (s) =>
    s === "Available" ? { color: "#16a34a", background: "#dcfce7" } : { color: "#dc2626", background: "#fee2e2" };

  return (
    <div className="ai-page">

      {/* Navbar */}
      <nav className="ai-nav">
        <div className="ai-nav-logo">
          <span className="ai-nav-title">ITAMS</span>
          <span className="ai-nav-sub">IT Asset Management System</span>
        </div>
        <div className="ai-nav-right">
          <span className="ai-nav-user">{username}</span>
          <span className="ai-nav-divider">|</span>
          <button className="ai-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div className="ai-body">

        <h1 className="ai-page-title">Asset Inventory</h1>
        <p className="ai-page-sub">Track and monitor all IT assets inventory in the organization.</p>

        {/* Select Asset dropdown */}
        <div className="ai-select-section">
          <label className="ai-select-label">Select Asset</label>
          <div className="ai-dropdown-wrapper">
            <button
              className="ai-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{selectedAsset}</span>
              <span className="ai-dropdown-arrow">&#8964;</span>
            </button>
            {dropdownOpen && (
              <ul className="ai-dropdown-list">
                {ASSET_FILTER_OPTIONS.map((opt) => (
                  <li
                    key={opt}
                    className={`ai-dropdown-item${selectedAsset === opt ? " ai-dropdown-item-active" : ""}`}
                    onClick={() => { setSelectedAsset(opt); setDropdownOpen(false); }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="ai-stats-row">
          {[
            { label: "Total Assets",       value: totalAssets,       sub: "All assets in system"  },
            { label: "Available Assets",   value: availableAssets,   sub: "Ready to assign"       },
            { label: "Assigned Assets",    value: assignedAssets,    sub: "Currently assigned"    },
            { label: "Under Maintenance",  value: maintenanceAssets, sub: "Being serviced"        },
            { label: "Out of Stock",       value: outOfStock,        sub: "Not available"         },
          ].map((stat) => (
            <div className="ai-stat-card" key={stat.label}>
              <span className="ai-stat-label">{stat.label}</span>
              <span className="ai-stat-value">{stat.value}</span>
              <span className="ai-stat-sub">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="ai-charts-row">

          {/* Inventory Overview */}
          <div className="ai-chart-card">
            <h2 className="ai-chart-title">Inventory Overview</h2>
            <div className="ai-chart-body">
              <PieChart slices={overviewSlices} size={170} />
              <div className="ai-legend">
                {overviewSlices.map((sl) => (
                  <div className="ai-legend-item" key={sl.label}>
                    <span className="ai-legend-dot" style={{ background: sl.color }} />
                    <span className="ai-legend-text">{sl.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="ai-chart-footer">Total Assets: {totalAssets}</p>
          </div>

          {/* Inventory by Category */}
          <div className="ai-chart-card">
            <h2 className="ai-chart-title">Inventory by Category</h2>
            <div className="ai-chart-body">
              <PieChart slices={categorySlices} size={170} />
              <div className="ai-legend">
                {categorySlices.map((sl) => (
                  <div className="ai-legend-item" key={sl.label}>
                    <span className="ai-legend-dot" style={{ background: sl.color }} />
                    <span className="ai-legend-text">{sl.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Inventory Details table */}
        <div className="ai-table-card">
          <h2 className="ai-table-title">Inventory Details</h2>
          <div className="ai-table-wrapper">
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Total Stock</th>
                  <th>Available</th>
                  <th>Assigned</th>
                  <th>Under Maintenance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => (
                  <tr key={asset.name}>
                    <td>{asset.name}</td>
                    <td>{asset.total}</td>
                    <td>{asset.available}</td>
                    <td>{asset.assigned}</td>
                    <td>{asset.maintenance}</td>
                    <td>
                      <span className="ai-status-badge" style={statusColor(asset.status)}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back button */}
        {onBack && (
          <button className="ai-back-btn" onClick={onBack}>Back</button>
        )}

      </div>
    </div>
  );
};

export default AssetInventory;
