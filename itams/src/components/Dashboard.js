import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = ({
  username,
  onLogout,
  onNavigateToDashboard,
  onNavigateToAssetManagement,
  onNavigateToAssetAssignment,
  onNavigateToRequestApproval,
  onNavigateToMaintenance,
}) => {
  // ── Live stats ──────────────────────────────────────
  const [stats, setStats] = useState({
    total: 0, available: 0, assigned: 0, maintenance: 0, pending: 0,
  });
  const [assetOverview, setAssetOverview] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    // Inventory for stat cards + overview table
    fetch("http://localhost:5000/api/inventory", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const inv = data.inventory || [];
        let total = 0, available = 0, assigned = 0, maintenance = 0;
        inv.forEach((row) => {
          total      += Number(row.total)       || 0;
          available  += Number(row.available)   || 0;
          assigned   += Number(row.assigned)    || 0;
          maintenance+= Number(row.maintenance) || 0;
        });
        setStats((prev) => ({ ...prev, total, available, assigned, maintenance }));
        // Build overview rows — one per asset type
        setAssetOverview(
          inv.map((row) => ({
            id: row.name,
            type: row.name,
            available: Number(row.available) || 0,
            status: Number(row.available) > 0 ? "Available" : "Not In Use",
            quantity: Number(row.total) || 0,
          }))
        );
      })
      .catch(() => {});

    // Pending requests count
    fetch("http://localhost:5000/api/asset-requests?status=Pending", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats((prev) => ({ ...prev, pending: (data.requests || []).length }));
      })
      .catch(() => {});

    // Recent activity from assignment history
    fetch("http://localhost:5000/api/asset-assignments/history", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const rows = (data.history || []).slice(0, 10).map((h) => ({
          date: h.assigned_date
            ? new Date(h.assigned_date).toLocaleDateString("en-GB").replace(/\//g, "-")
            : "-",
          activity: h.status === "Returned" ? "Asset Returned" : "Asset Assigned",
          assetId: h.asset_id || "-",
          assetType: h.asset_type || "-",
          employeeId: h.employee_id || "-",
          details: h.status === "Returned"
            ? "Asset returned by employee"
            : "Asset assigned to employee",
        }));
        setRecentActivity(rows);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="dashboard-brand">
          <div className="dashboard-logo">
            ITAMS
          </div>

          <div className="dashboard-subtitle">
            IT Asset Management System
          </div>
        </div>

        <div className="dashboard-user">

          <span>
            {username || "username"}
          </span>

          <span className="dashboard-divider">
            |
          </span>

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN LAYOUT ================= */}

      <div className="dashboard-layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="dashboard-sidebar">

          {/* DASHBOARD */}

          <button
            type="button"
            className="sidebar-item active"
            onClick={onNavigateToDashboard}
          >
            Dashboard
          </button>


          {/* ASSET MANAGEMENT */}

          <button
            type="button"
            className="sidebar-item"
            onClick={onNavigateToAssetManagement}
          >
            Asset Management
          </button>


          {/* ASSET ASSIGNMENT */}

          <button
            type="button"
            className="sidebar-item"
            onClick={onNavigateToAssetAssignment}
          >
            Asset Assignment
          </button>


          {/* REQUEST APPROVAL */}

          <button
            type="button"
            className="sidebar-item"
            onClick={onNavigateToRequestApproval}
          >
            Request Approval
          </button>


          {/* MAINTENANCE */}

          <button
            type="button"
            className="sidebar-item"
            onClick={onNavigateToMaintenance}
          >
            Maintenance
          </button>

        </aside>


        {/* ================= CONTENT ================= */}

        <main className="dashboard-content">

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-description">
            Overview of IT assets and their current status.
          </p>


          {/* ================= STAT CARDS ================= */}

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Assets</h3>
              <div className="stat-number blue">{stats.total}</div>
              <div className="stat-line"></div>
              <p>All assets in system</p>
            </div>

            <div className="stat-card">
              <h3>Available Assets</h3>
              <div className="stat-number green">{stats.available}</div>
              <div className="stat-line"></div>
              <p>Ready to assign</p>
            </div>

            <div className="stat-card">
              <h3>Assigned Assets</h3>
              <div className="stat-number purple">{stats.assigned}</div>
              <div className="stat-line"></div>
              <p>Assigned to employees</p>
            </div>

            <div className="stat-card">
              <h3>Under Maintenance</h3>
              <div className="stat-number orange">{stats.maintenance}</div>
              <div className="stat-line"></div>
              <p>Being repaired</p>
            </div>

            <div className="stat-card">
              <h3>Pending Requests</h3>
              <div className="stat-number red">{stats.pending}</div>
              <div className="stat-line"></div>
              <p>Waiting for approval</p>
            </div>

          </div>


          {/* ================= OVERVIEW + CHART ================= */}

          <div className="dashboard-middle">

            {/* ASSET OVERVIEW */}

            <section className="dashboard-box asset-overview">

              <h2>
                Asset Overview
              </h2>

              <div className="table-container">

                <table>

                  <thead>
                    <tr>
                      <th>Asset Type</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>

                    {assetOverview.map((asset) => (

                      <tr key={asset.id}>

                        <td>
                          {asset.type}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              asset.status === "Available"
                                ? "available"
                                : asset.status === "Assigned"
                                ? "assigned"
                                : "maintenance"
                            }`}
                          >
                            {asset.status}
                          </span>

                        </td>

                        <td>
                          {asset.quantity}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              <select className="table-select">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>

            </section>


            {/* ASSET TYPE SUMMARY */}

            <section className="dashboard-box asset-summary">

              <h2>Asset Type Summary</h2>

              {(() => {
                const COLORS = [
                  "#2563eb", "#22c55e", "#f97316", "#9333ea",
                  "#ef4444", "#f59e0b", "#06b6d4", "#ec4899",
                  "#14b8a6", "#8b5cf6",
                ];

                const total = assetOverview.reduce((s, a) => s + a.quantity, 0);

                // Build SVG donut segments
                const SIZE = 180;
                const OUTER = 80;
                const INNER = 48;
                const cx = SIZE / 2;
                const cy = SIZE / 2;

                let cumulative = 0;
                const segments = assetOverview
                  .filter((a) => a.quantity > 0)
                  .map((asset, i) => {
                    const fraction = asset.quantity / (total || 1);
                    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                    cumulative += fraction;
                    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                    const largeArc = fraction > 0.5 ? 1 : 0;

                    const x1 = cx + OUTER * Math.cos(startAngle);
                    const y1 = cy + OUTER * Math.sin(startAngle);
                    const x2 = cx + OUTER * Math.cos(endAngle);
                    const y2 = cy + OUTER * Math.sin(endAngle);
                    const x3 = cx + INNER * Math.cos(endAngle);
                    const y3 = cy + INNER * Math.sin(endAngle);
                    const x4 = cx + INNER * Math.cos(startAngle);
                    const y4 = cy + INNER * Math.sin(startAngle);

                    const d = `M ${x1} ${y1} A ${OUTER} ${OUTER} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${INNER} ${INNER} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                    return { d, color: COLORS[i % COLORS.length], asset };
                  });

                return (
                  <div className="summary-content">

                    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
                      <svg width={SIZE} height={SIZE}>
                        {segments.map((seg, i) => (
                          <path key={i} d={seg.d} fill={seg.color} stroke="#fff" strokeWidth="2" />
                        ))}
                        {/* Centre hole label */}
                        <text
                          x={cx} y={cy - 6}
                          textAnchor="middle"
                          fontSize="18"
                          fontWeight="700"
                          fill="#091e42"
                        >
                          {total}
                        </text>
                        <text
                          x={cx} y={cy + 12}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#5e6c84"
                        >
                          Total
                        </text>
                      </svg>
                    </div>

                    <div className="chart-legend">
                      {assetOverview.map((asset, index) => (
                        <div className="legend-item" key={asset.type}>
                          <span
                            className="legend-dot"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          <span>{asset.type}</span>
                          <strong>{asset.quantity}</strong>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })()}

              <div className="total-assets">
                Total Assets: {stats.total}
              </div>

            </section>

          </div>


          {/* ================= RECENT ACTIVITY ================= */}

          <section className="dashboard-box recent-activity">

            <h2>
              Recent Activity
            </h2>

            <div className="table-container activity-table">

              <table>

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Asset ID</th>
                    <th>Asset Type</th>
                    <th>Employee ID</th>
                    <th>Details</th>
                  </tr>

                </thead>

                <tbody>

                  {recentActivity.map((item, index) => (

                    <tr key={index}>

                      <td>{item.date}</td>
                      <td>{item.activity}</td>
                      <td>{item.assetId}</td>
                      <td>{item.assetType}</td>
                      <td>{item.employeeId}</td>
                      <td>{item.details}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <select className="activity-select">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>

          </section>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
