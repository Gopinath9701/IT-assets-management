import React from "react";
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
  const assetOverview = [
    {
      id: "LAP001",
      type: "Laptop",
      status: "Available",
      quantity: 25,
    },
    {
      id: "MON001",
      type: "Monitor",
      status: "Assigned",
      quantity: 30,
    },
    {
      id: "KEY001",
      type: "Keyboard",
      status: "Available",
      quantity: 20,
    },
    {
      id: "MOU001",
      type: "Mouse",
      status: "Assigned",
      quantity: 25,
    },
    {
      id: "PRI001",
      type: "Printer",
      status: "Under Maintenance",
      quantity: 10,
    },
  ];

  const recentActivity = [
    {
      date: "18-08-2026 10:30 AM",
      activity: "Asset Assigned",
      assetId: "LAP001",
      assetType: "Laptop",
      employeeId: "260818001",
      details: "Asset assigned to employee",
    },
    {
      date: "18-08-2026 09:45 AM",
      activity: "Asset Returned",
      assetId: "MON001",
      assetType: "Monitor",
      employeeId: "260817002",
      details: "Asset returned by employee",
    },
    {
      date: "18-08-2026 09:20 AM",
      activity: "Maintenance Issue Reported",
      assetId: "PRI001",
      assetType: "Printer",
      employeeId: "260818003",
      details: "Paper jam issue reported",
    },
    {
      date: "17-08-2026 04:15 PM",
      activity: "Maintenance Completed",
      assetId: "KEY001",
      assetType: "Keyboard",
      employeeId: "260816001",
      details: "Keys not working issue resolved",
    },
    {
      date: "17-08-2026 11:00 AM",
      activity: "New Asset Added",
      assetId: "LAP002",
      assetType: "Laptop",
      employeeId: "260817004",
      details: "New laptop added to inventory",
    },
  ];

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

              <div className="stat-number blue">
                120
              </div>

              <div className="stat-line"></div>

              <p>
                All assets in system
              </p>
            </div>


            <div className="stat-card">
              <h3>Available Assets</h3>

              <div className="stat-number green">
                35
              </div>

              <div className="stat-line"></div>

              <p>
                Ready to assign
              </p>
            </div>


            <div className="stat-card">
              <h3>Assigned Assets</h3>

              <div className="stat-number purple">
                75
              </div>

              <div className="stat-line"></div>

              <p>
                Assigned to employees
              </p>
            </div>


            <div className="stat-card">
              <h3>Under Maintenance</h3>

              <div className="stat-number orange">
                10
              </div>

              <div className="stat-line"></div>

              <p>
                Being repaired
              </p>
            </div>


            <div className="stat-card">
              <h3>Pending Requests</h3>

              <div className="stat-number red">
                8
              </div>

              <div className="stat-line"></div>

              <p>
                Waiting for approval
              </p>
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
                      <th>Asset ID</th>
                      <th>Asset Type</th>
                      <th>Status</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>

                    {assetOverview.map((asset) => (

                      <tr key={asset.id}>

                        <td>
                          {asset.id}
                        </td>

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

              <h2>
                Asset Type Summary
              </h2>

              <div className="summary-content">

                <div className="donut-chart">

                  <div className="donut-hole">
                    <span>120</span>
                  </div>

                </div>


                <div className="chart-legend">

                  <div className="legend-item">
                    <span className="legend-dot laptop"></span>
                    <span>Laptop</span>
                    <strong>25</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot monitor"></span>
                    <span>Monitor</span>
                    <strong>30</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot keyboard"></span>
                    <span>Keyboard</span>
                    <strong>20</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot mouse"></span>
                    <span>Mouse</span>
                    <strong>25</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot printer"></span>
                    <span>Printer</span>
                    <strong>10</strong>
                  </div>

                </div>

              </div>

              <div className="total-assets">
                Total Assets: 120
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
                    <th>Date & Time</th>
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
