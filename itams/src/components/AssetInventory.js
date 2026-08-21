import React, { useState } from "react";
import "./AssetInventory.css";

/* =========================================================
   ASSET DATA
========================================================= */

const ALL_ASSETS = [
  {
    name: "Laptop",
    total: 50,
    available: 18,
    assigned: 30,
    maintenance: 2,
    status: "Available",
    details: [
      {
        assetTag: "LAP001",
        brand: "HP",
        model: "ProBook 450 G9",
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "15 Feb 2026",
      },
      {
        assetTag: "LAP002",
        brand: "Dell",
        model: "Latitude 5420",
        status: "Assigned",
        assignedTo: "John Doe",
        location: "HR Department",
        purchaseDate: "10 Jan 2026",
      },
      {
        assetTag: "LAP003",
        brand: "Lenovo",
        model: "ThinkPad E14",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "20 Mar 2026",
      },
    ],
  },

  {
    name: "Monitor",
    total: 30,
    available: 7,
    assigned: 21,
    maintenance: 2,
    status: "Available",
    details: [
      {
        assetTag: "MON001",
        brand: "Dell",
        model: '24" LED Monitor',
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "10 Jan 2026",
      },
      {
        assetTag: "MON002",
        brand: "HP",
        model: '22" Full HD Monitor',
        status: "Assigned",
        assignedTo: "John Doe",
        location: "HR Department",
        purchaseDate: "15 Feb 2026",
      },
      {
        assetTag: "MON003",
        brand: "Lenovo",
        model: '27" IPS Monitor',
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "05 Mar 2026",
      },
    ],
  },

  {
    name: "Printer",
    total: 20,
    available: 5,
    assigned: 13,
    maintenance: 2,
    status: "Available",
    details: [
      {
        assetTag: "PRI001",
        brand: "Canon",
        model: "LBP6030",
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "20 May 2026",
      },
      {
        assetTag: "PRI002",
        brand: "HP",
        model: "LaserJet Pro",
        status: "Assigned",
        assignedTo: "Finance Team",
        location: "Finance Department",
        purchaseDate: "12 Apr 2026",
      },
      {
        assetTag: "PRI003",
        brand: "Epson",
        model: "EcoTank L3250",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "08 Jun 2026",
      },
    ],
  },

  {
    name: "Keyboard",
    total: 10,
    available: 4,
    assigned: 5,
    maintenance: 1,
    status: "Available",
    details: [
      {
        assetTag: "KEY001",
        brand: "Logitech",
        model: "K120",
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "12 May 2026",
      },
      {
        assetTag: "KEY002",
        brand: "Dell",
        model: "KB216",
        status: "Assigned",
        assignedTo: "John Doe",
        location: "HR Department",
        purchaseDate: "18 Apr 2026",
      },
      {
        assetTag: "KEY003",
        brand: "HP",
        model: "K500F",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "25 Jun 2026",
      },
    ],
  },

  {
    name: "Mouse",
    total: 10,
    available: 4,
    assigned: 5,
    maintenance: 1,
    status: "Available",
    details: [
      {
        assetTag: "MOU001",
        brand: "HP",
        model: "USB Optical Mouse",
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "12 Apr 2026",
      },
      {
        assetTag: "MOU002",
        brand: "Logitech",
        model: "M185 Wireless",
        status: "Assigned",
        assignedTo: "Jane Smith",
        location: "Development Team",
        purchaseDate: "20 Apr 2026",
      },
      {
        assetTag: "MOU003",
        brand: "Dell",
        model: "MS116",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "05 Jun 2026",
      },
    ],
  },

  {
    name: "Scanner",
    total: 5,
    available: 0,
    assigned: 4,
    maintenance: 1,
    status: "Out of Stock",
    details: [
      {
        assetTag: "SCA001",
        brand: "Canon",
        model: "LiDE 300",
        status: "Assigned",
        assignedTo: "Admin Team",
        location: "Admin Department",
        purchaseDate: "15 Jan 2026",
      },
      {
        assetTag: "SCA002",
        brand: "Epson",
        model: "V39 II",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "10 Feb 2026",
      },
    ],
  },

  {
    name: "Projector",
    total: 5,
    available: 0,
    assigned: 3,
    maintenance: 2,
    status: "Out of Stock",
    details: [
      {
        assetTag: "PRO001",
        brand: "Epson",
        model: "EB-E01",
        status: "Assigned",
        assignedTo: "Training Team",
        location: "Training Room",
        purchaseDate: "15 Mar 2026",
      },
      {
        assetTag: "PRO002",
        brand: "BenQ",
        model: "MS550",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "20 Apr 2026",
      },
    ],
  },

  {
    name: "CPU",
    total: 15,
    available: 5,
    assigned: 8,
    maintenance: 2,
    status: "Available",
    details: [
      {
        assetTag: "CPU001",
        brand: "HP",
        model: "ProDesk 400 G7",
        status: "Available",
        assignedTo: "-",
        location: "IT Store",
        purchaseDate: "25 Jan 2026",
      },
      {
        assetTag: "CPU002",
        brand: "Dell",
        model: "OptiPlex 7090",
        status: "Assigned",
        assignedTo: "Development Team",
        location: "Development Department",
        purchaseDate: "15 Feb 2026",
      },
      {
        assetTag: "CPU003",
        brand: "Lenovo",
        model: "ThinkCentre M70s",
        status: "Under Maintenance",
        assignedTo: "-",
        location: "IT Department",
        purchaseDate: "05 Mar 2026",
      },
    ],
  },
];

/* =========================================================
   FILTER OPTIONS
========================================================= */

const ASSET_FILTER_OPTIONS = [
  "All Assets (Complete Inventory)",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Laptop",
  "CPU",
  "Scanner",
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

  if (total === 0) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={radius}
          cy={radius}
          r={chartRadius}
          fill="#e5e7eb"
        />

        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#64748b"
        >
          No Data
        </text>
      </svg>
    );
  }

  let cumulative = 0;

  const paths = slices.map((slice) => {
    const startAngle =
      (cumulative / total) * 2 * Math.PI -
      Math.PI / 2;

    cumulative += slice.value;

    const endAngle =
      (cumulative / total) * 2 * Math.PI -
      Math.PI / 2;

    const x1 =
      radius +
      chartRadius * Math.cos(startAngle);

    const y1 =
      radius +
      chartRadius * Math.sin(startAngle);

    const x2 =
      radius +
      chartRadius * Math.cos(endAngle);

    const y2 =
      radius +
      chartRadius * Math.sin(endAngle);

    const largeArc =
      slice.value / total > 0.5 ? 1 : 0;

    const midAngle =
      (startAngle + endAngle) / 2;

    const labelX =
      radius +
      radius * 0.55 * Math.cos(midAngle);

    const labelY =
      radius +
      radius * 0.55 * Math.sin(midAngle);

    const percentage =
      Math.round(
        (slice.value / total) * 1000
      ) / 10;

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
  const [selectedAsset, setSelectedAsset] =
    useState("All Assets (Complete Inventory)");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState(null);

  /* =======================================================
     FILTERED ASSETS
  ======================================================= */

  const filteredAssets =
    selectedAsset ===
    "All Assets (Complete Inventory)"
      ? ALL_ASSETS
      : ALL_ASSETS.filter(
          (asset) =>
            asset.name === selectedAsset
        );

  /* =======================================================
     SELECTED ASSET DATA
  ======================================================= */

  const selectedAssetData =
    selectedAsset ===
    "All Assets (Complete Inventory)"
      ? null
      : filteredAssets[0];

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalAssets = filteredAssets.reduce(
    (sum, asset) =>
      sum + asset.total,
    0
  );

  const availableAssets =
    filteredAssets.reduce(
      (sum, asset) =>
        sum + asset.available,
      0
    );

  const assignedAssets =
    filteredAssets.reduce(
      (sum, asset) =>
        sum + asset.assigned,
      0
    );

  const maintenanceAssets =
    filteredAssets.reduce(
      (sum, asset) =>
        sum + asset.maintenance,
      0
    );

  const outOfStockAssets =
    filteredAssets.reduce(
      (sum, asset) =>
        sum +
        (asset.status ===
        "Out of Stock"
          ? 1
          : 0),
      0
    );

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
  ].filter(
    (slice) => slice.value > 0
  );

  /* =======================================================
     CATEGORY PIE CHART
  ======================================================= */

  let categorySlices = [];

  if (
    selectedAsset ===
    "All Assets (Complete Inventory)"
  ) {
    categorySlices =
      ALL_ASSETS.map(
        (asset, index) => {
          const colors = [
            "#2563eb",
            "#22c55e",
            "#f97316",
            "#9333ea",
            "#ef4444",
            "#06b6d4",
            "#eab308",
            "#64748b",
          ];

          return {
            label: `${asset.name} (${asset.total})`,
            value: asset.total,
            color:
              colors[
                index %
                  colors.length
              ],
          };
        }
      );
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
    ].filter(
      (slice) => slice.value > 0
    );
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

    if (status === "Assigned") {
      return {
        color: "#2563eb",
        backgroundColor: "#dbeafe",
      };
    }

    if (status === "Under Maintenance") {
      return {
        color: "#d97706",
        backgroundColor: "#fef3c7",
      };
    }

    return {
      color: "#dc2626",
      backgroundColor: "#fee2e2",
    };
  };

  /* =======================================================
     DROPDOWN CHANGE
  ======================================================= */

  const handleAssetChange = (option) => {
    setSelectedAsset(option);
    setDropdownOpen(false);

    setSelectedInventoryItem(null);
  };

  /* =======================================================
     ROW CLICK
  ======================================================= */

  const handleInventoryRowClick = (item) => {
    setSelectedInventoryItem(item);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setSelectedInventoryItem(null);
  };

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
          Track and monitor all IT assets
          inventory in the organization.
        </p>

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
                setDropdownOpen(
                  !dropdownOpen
                )
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
                        selectedAsset ===
                        option
                          ? "ai-dropdown-item ai-dropdown-item-active"
                          : "ai-dropdown-item"
                      }
                      onClick={() =>
                        handleAssetChange(
                          option
                        )
                      }
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
              {selectedAsset ===
              "All Assets (Complete Inventory)"
                ? "Total Assets"
                : `Total ${selectedAsset}s`}
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

          {/* INVENTORY OVERVIEW */}

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

          {/* CATEGORY / STATUS OVERVIEW */}

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
            INVENTORY DETAILS

            ALL ASSETS:
            SHOW SUMMARY TABLE

            SPECIFIC ASSET:
            SHOW DETAILED TABLE
        ================================================= */}

        <div className="ai-table-card">

          {/* =================================================
              ALL ASSETS SUMMARY TABLE
          ================================================= */}

          {selectedAsset ===
          "All Assets (Complete Inventory)" ? (

            <>

              <h2 className="ai-table-title">
                Inventory Details
              </h2>

              <div className="ai-table-wrapper">

                <table className="ai-table">

                  <thead>

                    <tr>

                      {/* CHANGED: Asset tag → Asset Type */}
                      <th>
                        Asset Type
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

                    {ALL_ASSETS.map(
                      (asset) => (

                        <tr
                          key={asset.name}
                          className="ai-clickable-row"
                          onClick={() =>
                            handleAssetChange(
                              asset.name
                            )
                          }
                          title={`View ${asset.name} inventory`}
                        >

                          <td>
                            <strong>
                              {asset.name}
                            </strong>
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

              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Showing {ALL_ASSETS.length} asset
                categories
              </div>

            </>

          ) : (

            /* =================================================
               SPECIFIC ASSET DETAIL TABLE
            ================================================= */

            <>

              <h2 className="ai-table-title">
                Inventory Details ({selectedAsset})
              </h2>

              <div className="ai-table-wrapper">

                <table className="ai-table">

                  <thead>

                    <tr>

                      {/* CHANGED: Asset type → Asset ID */}
                      <th>
                        Asset ID
                      </th>

                      <th>
                        Brand
                      </th>

                      <th>
                        Model
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Assigned To
                      </th>

                      <th>
                        Location
                      </th>

                      <th>
                        Purchase Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {selectedAssetData &&
                    selectedAssetData.details &&
                    selectedAssetData.details.length > 0 ? (

                      selectedAssetData.details.map(
                        (item) => (

                          <tr
                            key={
                              item.assetTag
                            }
                            className="ai-clickable-row"
                            onClick={() =>
                              handleInventoryRowClick(
                                item
                              )
                            }
                            title="Click to view complete asset details"
                          >

                            <td>
                              <strong>
                                {item.assetTag}
                              </strong>
                            </td>

                            <td>
                              {item.brand}
                            </td>

                            <td>
                              {item.model}
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

                            <td>
                              {item.assignedTo}
                            </td>

                            <td>
                              {item.location}
                            </td>

                            <td>
                              {item.purchaseDate}
                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="7"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "20px",
                          }}
                        >
                          No details available
                          for this asset.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Showing{" "}
                {selectedAssetData &&
                selectedAssetData.details
                  ? selectedAssetData
                      .details.length
                  : 0}{" "}
                {selectedAsset} assets
              </div>

            </>

          )}

        </div>

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

      {/* =====================================================
          ASSET DETAIL MODAL
      ===================================================== */}

      {selectedInventoryItem && (

        <div
          className="ai-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="ai-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="ai-modal-header">

              <div>

                <h2 className="ai-modal-title">
                  Asset Details
                </h2>

                <p className="ai-modal-subtitle">
                  Complete inventory information
                </p>

              </div>

              <button
                className="ai-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="ai-modal-body">

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Asset ID
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.assetTag}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Brand
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.brand}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Model
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.model}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Status
                </span>

                <span
                  className="ai-status-badge"
                  style={getStatusStyle(
                    selectedInventoryItem.status
                  )}
                >
                  {selectedInventoryItem.status}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Assigned To
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.assignedTo}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Location
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.location}
                </span>

              </div>

              <div className="ai-modal-item">

                <span className="ai-modal-label">
                  Purchase Date
                </span>

                <span className="ai-modal-value">
                  {selectedInventoryItem.purchaseDate}
                </span>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="ai-modal-footer">

              <button
                className="ai-modal-close-btn"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AssetInventory;
