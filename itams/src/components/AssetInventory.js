import React, { useState, useEffect } from "react";
import "./AssetInventory.css";

const ASSET_FILTER_OPTIONS = [
  "All Assets (Complete Inventory)",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Laptop",
  "CPU",
  "Webcam",
  "Projector",
];

/* =========================================================
   PIE CHART
========================================================= */

const PieChart = ({ slices, size = 180 }) => {
  const radius = size / 2;
  const chartRadius = radius * 0.85;

  const total = slices.reduce(
    (sum, slice) => sum + slice.value,
    0
  );

  let cumulative = 0;

  const paths = slices.map((slice) => {
    const startAngle =
      (cumulative / total) * 2 * Math.PI - Math.PI / 2;

    cumulative += slice.value;

    const endAngle =
      (cumulative / total) * 2 * Math.PI - Math.PI / 2;

    const x1 =
      radius + chartRadius * Math.cos(startAngle);

    const y1 =
      radius + chartRadius * Math.sin(startAngle);

    const x2 =
      radius + chartRadius * Math.cos(endAngle);

    const y2 =
      radius + chartRadius * Math.sin(endAngle);

    const largeArc =
      slice.value / total > 0.5 ? 1 : 0;

    const midAngle =
      (startAngle + endAngle) / 2;

    const labelX =
      radius + radius * 0.55 * Math.cos(midAngle);

    const labelY =
      radius + radius * 0.55 * Math.sin(midAngle);

    const percentage =
      Math.round((slice.value / total) * 1000) / 10;

    return {
      path: `
        M ${radius} ${radius}
        L ${x1} ${y1}
        A ${chartRadius} ${chartRadius}
        0 ${largeArc} 1
        ${x2} ${y2}
        Z
      `,
      color: slice.color,
      labelX,
      labelY,
      percentage,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {paths.map((item, index) => (
        <path
          key={index}
          d={item.path}
          fill={item.color}
          stroke="#ffffff"
          strokeWidth="2"
        />
      ))}

      {paths.map((item, index) => (
        <text
          key={`text-${index}`}
          x={item.labelX}
          y={item.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="#ffffff"
          fontWeight="700"
        >
          {item.percentage}%
        </text>
      ))}
    </svg>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AssetInventory = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [allAssets, setAllAssets] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/inventory", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAllAssets(data.inventory || []);
        else setLoadError(data.message || "Failed to load inventory");
      })
      .catch(() => setLoadError("Unable to connect to server."));
  }, []);

  const [selectedAsset, setSelectedAsset] = useState(
    "All Assets (Complete Inventory)"
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredAssets =
    selectedAsset === "All Assets (Complete Inventory)"
      ? allAssets
      : allAssets.filter((a) => a.name === selectedAsset);

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalAssets = filteredAssets.reduce(
    (sum, asset) => sum + asset.total,
    0
  );

  const availableAssets = filteredAssets.reduce(
    (sum, asset) => sum + asset.available,
    0
  );

  const assignedAssets = filteredAssets.reduce(
    (sum, asset) => sum + asset.assigned,
    0
  );

  const maintenanceAssets = filteredAssets.reduce(
    (sum, asset) => sum + asset.maintenance,
    0
  );

  const outOfStockAssets = filteredAssets.filter(
    (asset) => asset.status === "Out of Stock"
  ).length;

  /* =======================================================
     OVERVIEW PIE CHART
  ======================================================= */

  const overviewSlices = [
    {
      label: `Available (${availableAssets})`,
      value: availableAssets,
      color: "#2563eb",
    },
    {
      label: `Assigned (${assignedAssets})`,
      value: assignedAssets,
      color: "#22c55e",
    },
    {
      label: `Under Maintenance (${maintenanceAssets})`,
      value: maintenanceAssets,
      color: "#9333ea",
    },
  ].filter((slice) => slice.value > 0);

  /* =======================================================
     CATEGORY PIE CHART
  ======================================================= */

  let categorySlices = [];

  if (selectedAsset === "All Assets (Complete Inventory)") {
    // Build per-type slices from live data
    const colors = ["#2563eb","#22c55e","#f97316","#9333ea","#ef4444","#f59e0b","#06b6d4"];
    categorySlices = allAssets.map((a, i) => ({
      label: `${a.name} (${a.total})`,
      value: Number(a.total) || 0,
      color: colors[i % colors.length],
    })).filter((s) => s.value > 0);
  } else {

    categorySlices = [
      {
        label: `Available (${availableAssets})`,
        value: availableAssets,
        color: "#2563eb",
      },
      {
        label: `Assigned (${assignedAssets})`,
        value: assignedAssets,
        color: "#22c55e",
      },
      {
        label: `Under Maintenance (${maintenanceAssets})`,
        value: maintenanceAssets,
        color: "#9333ea",
      },
    ].filter((slice) => slice.value > 0);

  }

  /* =======================================================
     STATUS STYLE
  ======================================================= */

  const getStatusStyle = (status) => {

    if (status === "Available") {

      return {
        color: "#15803d",
        backgroundColor: "#dcfce7",
      };

    }

    return {
      color: "#dc2626",
      backgroundColor: "#fee2e2",
    };
  };

  /* =======================================================
     TABLE TITLE
  ======================================================= */

  const tableTitle =
    selectedAsset ===
    "All Assets (Complete Inventory)"
      ? "Inventory Details"
      : `Inventory Details (${selectedAsset})`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="ai-page">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="ai-nav">

        <div className="ai-nav-logo">

          <span className="ai-nav-title">
            ITAMS
          </span>

          <span className="ai-nav-sub">
            IT Asset Management System
          </span>

        </div>

        <div className="ai-nav-right">

          <span className="ai-nav-user">
            {username}
          </span>

          <span className="ai-nav-divider">
            |
          </span>

          <button
            className="ai-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ===================================================
          BODY
      =================================================== */}

      <main className="ai-body">

        <h1 className="ai-page-title">
          Asset Inventory
        </h1>

        <p className="ai-page-sub">
          Track and monitor all IT assets inventory
          in the organization.
        </p>

        {loadError && (
          <div style={{ color: "#dc2626", marginBottom: "12px" }}>⚠️ {loadError}</div>
        )}


        {/* =================================================
            SELECT ASSET
        ================================================= */}

        <div className="ai-select-section">

          <label className="ai-select-label">
            Select Asset
          </label>

          <div className="ai-dropdown-wrapper">

            <button
              type="button"
              className="ai-dropdown-btn"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
            >

              <span>
                {selectedAsset}
              </span>

              <span className="ai-dropdown-arrow">
                ▼
              </span>

            </button>


            {dropdownOpen && (

              <ul className="ai-dropdown-list">

                {ASSET_FILTER_OPTIONS.map(
                  (option) => (

                    <li
                      key={option}
                      className={
                        selectedAsset === option
                          ? "ai-dropdown-item ai-dropdown-item-active"
                          : "ai-dropdown-item"
                      }
                      onClick={() => {

                        setSelectedAsset(option);

                        setDropdownOpen(false);

                      }}
                    >
                      {option}
                    </li>

                  )
                )}

              </ul>

            )}

          </div>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="ai-stats-row">

          <div className="ai-stat-card">

            <span className="ai-stat-label">
              Total Assets
            </span>

            <span className="ai-stat-value">
              {totalAssets}
            </span>

            <span className="ai-stat-sub">
              {selectedAsset ===
              "All Assets (Complete Inventory)"
                ? "All assets in system"
                : `All ${selectedAsset}s in system`}
            </span>

          </div>


          <div className="ai-stat-card">

            <span className="ai-stat-label">
              Available Assets
            </span>

            <span className="ai-stat-value">
              {availableAssets}
            </span>

            <span className="ai-stat-sub">
              Ready to assign
            </span>

          </div>


          <div className="ai-stat-card">

            <span className="ai-stat-label">
              Assigned Assets
            </span>

            <span className="ai-stat-value">
              {assignedAssets}
            </span>

            <span className="ai-stat-sub">
              Currently assigned
            </span>

          </div>


          <div className="ai-stat-card">

            <span className="ai-stat-label">
              Under Maintenance
            </span>

            <span className="ai-stat-value">
              {maintenanceAssets}
            </span>

            <span className="ai-stat-sub">
              Being serviced
            </span>

          </div>


          <div className="ai-stat-card">

            <span className="ai-stat-label">
              Out of Stock
            </span>

            <span className="ai-stat-value">
              {outOfStockAssets}
            </span>

            <span className="ai-stat-sub">
              Not available
            </span>

          </div>

        </div>


        {/* =================================================
            CHARTS
        ================================================= */}

        <div className="ai-charts-row">

          {/* Inventory Overview */}

          <div className="ai-chart-card">

            <h2 className="ai-chart-title">
              Inventory Overview
            </h2>

            <div className="ai-chart-body">

              <PieChart
                slices={overviewSlices}
                size={180}
              />

              <div className="ai-legend">

                {overviewSlices.map(
                  (slice) => (

                    <div
                      className="ai-legend-item"
                      key={slice.label}
                    >

                      <span
                        className="ai-legend-dot"
                        style={{
                          background:
                            slice.color,
                        }}
                      />

                      <span className="ai-legend-text">
                        {slice.label}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            <p className="ai-chart-footer">
              {selectedAsset ===
              "All Assets (Complete Inventory)"
                ? `Total Assets: ${totalAssets}`
                : `Total ${selectedAsset}s: ${totalAssets}`}
            </p>

          </div>


          {/* Category / Status Overview */}

          <div className="ai-chart-card">

            <h2 className="ai-chart-title">

              {selectedAsset ===
              "All Assets (Complete Inventory)"
                ? "Inventory by Category"
                : `${selectedAsset} Status Overview`}

            </h2>

            <div className="ai-chart-body">

              <PieChart
                slices={categorySlices}
                size={180}
              />

              <div className="ai-legend">

                {categorySlices.map(
                  (slice) => (

                    <div
                      className="ai-legend-item"
                      key={slice.label}
                    >

                      <span
                        className="ai-legend-dot"
                        style={{
                          background:
                            slice.color,
                        }}
                      />

                      <span className="ai-legend-text">
                        {slice.label}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            INVENTORY TABLE
        ================================================= */}

        <div className="ai-table-card">

          <h2 className="ai-table-title">
            {tableTitle}
          </h2>

          <div className="ai-table-wrapper">

            <table className="ai-table">

              <thead>

                <tr>

                  <th>
                    Asset Name
                  </th>

                  <th>
                    Total Stock
                  </th>

                  <th>
                    Available
                  </th>

                  <th>
                    Assigned
                  </th>

                  <th>
                    Under Maintenance
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAssets.map(
                  (asset) => (

                    <tr key={asset.name}>

                      <td>
                        {asset.name}
                      </td>

                      <td>
                        {asset.total}
                      </td>

                      <td>
                        {asset.available}
                      </td>

                      <td>
                        {asset.assigned}
                      </td>

                      <td>
                        {asset.maintenance}
                      </td>

                      <td>

                        <span
                          className="ai-status-badge"
                          style={getStatusStyle(
                            asset.status
                          )}
                        >
                          {asset.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            MONITOR DETAILS
        ================================================= */}

        {selectedAsset === "Monitor" &&
          filteredAssets[0]?.details && (

          <div className="ai-table-card">

            <h2 className="ai-table-title">
              Inventory Details (Monitor)
            </h2>

            <div className="ai-table-wrapper">

              <table className="ai-table">

                <thead>

                  <tr>

                    <th>
                      Asset Name
                    </th>

                    <th>
                      Total Stock
                    </th>

                    <th>
                      Available
                    </th>

                    <th>
                      Assigned
                    </th>

                    <th>
                      Under Maintenance
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAssets[0].details.map(
                    (item) => (

                      <tr key={item.name}>

                        <td>
                          {item.name}
                        </td>

                        <td>
                          {item.total}
                        </td>

                        <td>
                          {item.available}
                        </td>

                        <td>
                          {item.assigned}
                        </td>

                        <td>
                          {item.maintenance}
                        </td>

                        <td>

                          <span
                            className="ai-status-badge"
                            style={getStatusStyle(
                              item.status
                            )}
                          >
                            {item.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                  <tr className="ai-total-row">

                    <td>
                      Total
                    </td>

                    <td>
                      30
                    </td>

                    <td>
                      7
                    </td>

                    <td>
                      21
                    </td>

                    <td>
                      2
                    </td>

                    <td>
                      -
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        {onBack && (

          <div className="ai-back-container">

            <button
              className="ai-back-btn"
              onClick={onBack}
            >
              Back
            </button>

          </div>

        )}

      </main>

    </div>

  );
};

export default AssetInventory;
