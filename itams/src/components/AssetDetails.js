import React, { useEffect, useState } from "react";
import "./AssetDetails.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

// ==========================================
// STATUS BADGE CLASSES
// ==========================================
const STATUS_CLASS = {
  Active: "ad-badge--active",
  Inactive: "ad-badge--inactive",
  onLeave: "ad-badge--onleave",
  "On Leave": "ad-badge--onleave",

  // Keep these if your backend still has old values
  "In Use": "ad-badge--inuse",
  "Under Maintenance": "ad-badge--maintenance",
  "Not In Use": "ad-badge--notinuse",
};

// ==========================================
// FIXED ASSET TYPE OPTIONS
// ==========================================
const ASSET_TYPE_OPTIONS = [
  "All Asset Types",
  "Monitor",
  "Keyboard",
  "Webcam",
  "CPU",
  "Mouse",
  "Projector",
  "Printer",
];

// ==========================================
// FIXED STATUS OPTIONS
// ==========================================
const STATUS_OPTIONS = [
  "All Status",
  "Active",
  "Inactive",
  "onLeave",
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const AssetDetails = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  // ==========================================
  // SIDEBAR
  // ==========================================
  const [activeSidebar, setActiveSidebar] =
    useState("asset-management");

  // ==========================================
  // ASSETS FROM DATABASE
  // ==========================================
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // ==========================================
  // SEARCH / FILTER
  // ==========================================
  const [searchText, setSearchText] = useState("");

  const [filterCat, setFilterCat] =
    useState("All Asset Types");

  const [filterStat, setFilterStat] =
    useState("All Status");

  const [searchError, setSearchError] =
    useState("");

  const [showFieldError, setShowFieldError] =
    useState(false);

  // ==========================================
  // TABLE
  // ==========================================
  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // ==========================================
  // VIEW ASSET
  // ==========================================
  const [selectedAsset, setSelectedAsset] =
    useState(null);

  // ==========================================
  // SIDEBAR ITEMS
  // ==========================================
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "asset-management",
      label: "Asset Management",
    },
    {
      id: "asset-assignment",
      label: "Asset Assignment",
    },
    {
      id: "request-approval",
      label: "Request Approval",
    },
    {
      id: "maintenance",
      label: "Maintenance",
    },
  ];

  // ==========================================
  // FIXED FILTER OPTIONS
  // ==========================================
  const categories = ASSET_TYPE_OPTIONS;
  const statuses = STATUS_OPTIONS;

  // ==========================================
  // FETCH ASSETS FROM BACKEND
  // ==========================================
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Login session expired. Please login again."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/assets",
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch assets"
        );
      }

      setAssets(data.assets || []);
    } catch (error) {
      console.error(
        "Fetch Assets Error:",
        error
      );

      setFetchError(
        error.message ||
          "Unable to load assets from server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ASSETS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchAssets();

    // Prevent exhaustive-deps warning
    // because fetchAssets is intentionally
    // called only when the page loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // SIDEBAR CLICK
  // ==========================================
  const handleSidebarClick = (item) => {
    console.log(
      "AssetDetails sidebar clicked:",
      item.id
    );

    setActiveSidebar(item.id);

    if (onSidebarNavigate) {
      onSidebarNavigate(item.id);
    }
  };

  // ==========================================
  // SEARCH VALIDATION
  // ==========================================
  const validateSearch = () => {
    setSearchError("");
    setShowFieldError(false);

    const hasSearch =
      searchText.trim() !== "";

    const hasFilter =
      filterCat !== "All Asset Types" ||
      filterStat !== "All Status";

    if (!hasSearch && !hasFilter) {
      setSearchError(
        "Please enter a search term or select at least one filter."
      );

      setShowFieldError(true);

      return false;
    }

    return true;
  };

  // ==========================================
  // SEARCH BUTTON
  // ==========================================
  const applyFilters = () => {
    validateSearch();
  };

  // ==========================================
  // SEARCH INPUT
  // ==========================================
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    setSearchError("");
    setShowFieldError(false);
  };

  // ==========================================
  // FILTER CHANGE
  // ==========================================
  const handleFilterChange =
    (setter) => (e) => {
      setter(e.target.value);

      setSearchError("");
      setShowFieldError(false);
    };

  // ==========================================
  // ENTER KEY
  // ==========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      applyFilters();
    }
  };

  // ==========================================
  // RESET
  // ==========================================
  const handleReset = () => {
    setSearchText("");

    setFilterCat(
      "All Asset Types"
    );

    setFilterStat(
      "All Status"
    );

    setSearchError("");
    setShowFieldError(false);
  };

  // ==========================================
  // FILTER DATABASE DATA
  // ==========================================
  const filtered = assets.filter(
    (asset) => {
      const search =
        searchText
          .toLowerCase()
          .trim();

      // ========================================
      // SEARCH MATCH
      // ========================================
      const matchSearch =
        search === "" ||
        (asset.asset_name || "")
          .toLowerCase()
          .includes(search) ||
        (asset.asset_id || "")
          .toLowerCase()
          .includes(search);

      // ========================================
      // ASSET TYPE MATCH
      // ========================================
      const matchCategory =
        filterCat ===
          "All Asset Types" ||
        asset.asset_type ===
          filterCat;

      // ========================================
      // STATUS MATCH
      // ========================================
      let matchStatus = true;

      if (
        filterStat !== "All Status"
      ) {
        if (
          filterStat === "onLeave"
        ) {
          // Accept both possible
          // backend values
          matchStatus =
            asset.status ===
              "onLeave" ||
            asset.status ===
              "On Leave";
        } else {
          matchStatus =
            asset.status ===
            filterStat;
        }
      }

      return (
        matchSearch &&
        matchCategory &&
        matchStatus
      );
    }
  );

  // ==========================================
  // DISPLAYED ROWS
  // ==========================================
  const displayed =
    rowsPerPage === "All"
      ? filtered
      : filtered.slice(
          0,
          rowsPerPage
        );

  // ==========================================
  // STATISTICS
  // ==========================================
  const totalAssets =
    assets.length;

  const inUse = assets.filter(
    (asset) =>
      asset.status ===
      "In Use"
  ).length;

  const underMaintenance =
    assets.filter(
      (asset) =>
        asset.status ===
        "Under Maintenance"
    ).length;

  const notInUse =
    assets.filter(
      (asset) =>
        asset.status ===
        "Not In Use"
    ).length;

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-GB"
      );
    } catch {
      return date;
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="ad-page-wrapper">

      {/* ======================================
          TOP NAVBAR
      ====================================== */}
      <nav className="ad-top-nav">

        <div className="ad-nav-logo">

          <span className="ad-nav-logo-title">
            ITAMS
          </span>

          <span className="ad-nav-logo-sub">
            IT Asset Management System
          </span>

        </div>

        <div className="ad-nav-right">

          <span className="ad-nav-username">
            {username}
          </span>

          <div className="ad-nav-divider" />

          <button
            className="ad-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ======================================
          BODY
      ====================================== */}
      <div className="ad-body-wrapper">

        {/* ====================================
            SIDEBAR
        ==================================== */}
        <aside className="ad-sidebar">

          {sidebarItems.map(
            (item) => (

              <div
                key={item.id}
                className={
                  "ad-sidebar-item" +
                  (
                    activeSidebar ===
                    item.id
                      ? " ad-sidebar-item--active"
                      : ""
                  )
                }
                onClick={() =>
                  handleSidebarClick(
                    item
                  )
                }
              >
                {item.label}
              </div>

            )
          )}

        </aside>

        {/* ====================================
            MAIN CONTENT
        ==================================== */}
        <main className="ad-main-content">

          {/* PAGE TITLE */}
          <h1 className="ad-page-title">
            Asset Details
          </h1>

          <div className="ad-breadcrumb">

            <span className="ad-breadcrumb-link">
              Dashboard
            </span>

            <span className="ad-breadcrumb-sep">
              &gt;
            </span>

            <span className="ad-breadcrumb-current">
              Asset Details
            </span>

          </div>

          {/* ==================================
              STAT CARDS
          ================================== */}
          <div className="ad-stats-row">

            <div className="ad-stat-card">

              <span className="ad-stat-label">
                Total Assets
              </span>

              <span className="ad-stat-value">
                {totalAssets}
              </span>

            </div>

            <div className="ad-stat-card">

              <span className="ad-stat-label">
                In Use
              </span>

              <span className="ad-stat-value">
                {inUse}
              </span>

            </div>

            <div className="ad-stat-card">

              <span className="ad-stat-label">
                Under Maintenance
              </span>

              <span className="ad-stat-value">
                {underMaintenance}
              </span>

            </div>

            <div className="ad-stat-card">

              <span className="ad-stat-label">
                Not In Use
              </span>

              <span className="ad-stat-value">
                {notInUse}
              </span>

            </div>

          </div>

          {/* ==================================
              SEARCH / FILTER
          ================================== */}
          <div className="ad-filters-row">

            {/* SEARCH */}
            <div
              className={
                `ad-search-wrapper ${
                  showFieldError
                    ? "ad-search-wrapper--error"
                    : ""
                }`
              }
            >

              <svg
                className="ad-search-icon"
                viewBox="0 0 20 20"
                fill="none"
              >

                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="#9ca3af"
                  strokeWidth="1.8"
                />

                <path
                  d="M15 15l-3-3"
                  stroke="#9ca3af"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

              </svg>

              <input
                className={
                  `ad-search-input ${
                    showFieldError
                      ? "ad-input--error"
                      : ""
                  }`
                }
                type="text"
                placeholder="Search assets..."
                value={searchText}
                onChange={
                  handleSearchChange
                }
                onKeyDown={
                  handleKeyDown
                }
              />

            </div>

            {/* =================================
                ASSET TYPE DROPDOWN
            ================================= */}
            <select
              className={
                `ad-filter-select ${
                  showFieldError
                    ? "ad-input--error"
                    : ""
                }`
              }
              value={filterCat}
              onChange={
                handleFilterChange(
                  setFilterCat
                )
              }
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>

            {/* =================================
                STATUS DROPDOWN
            ================================= */}
            <select
              className={
                `ad-filter-select ${
                  showFieldError
                    ? "ad-input--error"
                    : ""
                }`
              }
              value={filterStat}
              onChange={
                handleFilterChange(
                  setFilterStat
                )
              }
            >

              {statuses.map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>

                )
              )}

            </select>

            {/* SEARCH BUTTON */}
            <button
              className="ad-search-btn"
              onClick={
                applyFilters
              }
            >
              Search
            </button>

            {/* RESET BUTTON */}
            <button
              className="ad-reset-btn"
              onClick={
                handleReset
              }
            >
              Reset
            </button>

          </div>

          {/* ==================================
              SEARCH ERROR
          ================================== */}
          {searchError && (

            <div className="ad-error-container">

              <span className="ad-error-text">
                ⚠️ {searchError}
              </span>

            </div>

          )}

          {/* ==================================
              FETCH ERROR
          ================================== */}
          {fetchError && (

            <div className="ad-error-container">

              <span className="ad-error-text">
                ⚠️ {fetchError}
              </span>

            </div>

          )}

          {/* ==================================
              BACK BUTTON
          ================================== */}
          <div className="ad-back-row">

            <button
              className="ad-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>

          {/* ==================================
              LOADING / TABLE
          ================================== */}
          {loading ? (

            <div className="ad-error-container">

              <span className="ad-error-text">
                Loading assets...
              </span>

            </div>

          ) : (

            <div className="ad-table-wrapper">

              <table className="ad-table">

                <thead>

                  <tr>

                    <th>
                      Asset ID
                    </th>

                    <th>
                      Asset Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Purchase Date
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {displayed.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="ad-no-data"
                      >
                        No assets found.
                      </td>

                    </tr>

                  ) : (

                    displayed.map(
                      (asset) => (

                        <tr
                          key={
                            asset.asset_id
                          }
                        >

                          {/* ASSET ID */}
                          <td>

                            <span className="ad-asset-id">
                              {
                                asset.asset_id
                              }
                            </span>

                          </td>

                          {/* ASSET TYPE */}
                          <td>
                            {
                              asset.asset_type ||
                              "-"
                            }
                          </td>

                          {/* STATUS */}
                          <td>

                            <span
                              className={
                                `ad-badge ${
                                  STATUS_CLASS[
                                    asset.status
                                  ] || ""
                                }`
                              }
                            >
                              {
                                asset.status ||
                                "-"
                              }
                            </span>

                          </td>

                          {/* PURCHASE DATE */}
                          <td>

                            {formatDate(
                              asset.purchase_date
                            )}

                          </td>

                          {/* ACTION */}
                          <td>

                            <button
                              className="ad-view-btn"
                              onClick={() =>
                                setSelectedAsset(
                                  asset
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* ==================================
              TABLE FOOTER
          ================================== */}
          <div className="ad-table-footer">

            <span className="ad-pagination-info">

              Showing{" "}
              {displayed.length}{" "}
              of{" "}
              {filtered.length}{" "}
              assets

            </span>

            <select
              className="ad-rows-select"
              value={rowsPerPage}
              onChange={(e) => {

                const value =
                  e.target.value;

                setRowsPerPage(
                  value === "All"
                    ? "All"
                    : Number(value)
                );

              }}
            >

              {ROWS_OPTIONS.map(
                (option) => (

                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>

                )
              )}

            </select>

          </div>

        </main>

      </div>

      {/* ======================================
          ASSET DETAIL MODAL
      ====================================== */}
      {selectedAsset && (

        <div
          className="ad-overlay"
          onClick={() =>
            setSelectedAsset(null)
          }
        >

          <div
            className="ad-detail-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}
            <div className="ad-detail-header">

              <h2 className="ad-detail-title">
                Asset Details
              </h2>

              <button
                className="ad-detail-close"
                onClick={() =>
                  setSelectedAsset(null)
                }
                aria-label="Close"
              >
                ✕
              </button>

            </div>

            {/* DETAILS */}
            <div className="ad-detail-body">

              {[
                [
                  "Asset ID",
                  selectedAsset.asset_id,
                ],

                [
                  "Asset Type",
                  selectedAsset.asset_type,
                ],

                [
                  "Brand",
                  selectedAsset.brand,
                ],

                [
                  "Model",
                  selectedAsset.model,
                ],

                [
                  "Status",
                  selectedAsset.status,
                ],

                [
                  "Purchase Date",
                  formatDate(
                    selectedAsset.purchase_date
                  ),
                ],

                [
                  "Warranty Expiry",
                  formatDate(
                    selectedAsset.warranty_expiry
                  ),
                ],

                [
                  "Description",
                  selectedAsset.description,
                ],
              ].map(
                ([label, value]) => (

                  <div
                    className="ad-detail-row"
                    key={label}
                  >

                    <span className="ad-detail-label">
                      {label}
                    </span>

                    <span className="ad-detail-value">
                      {value || "-"}
                    </span>

                  </div>

                )
              )}

            </div>

            {/* FOOTER */}
            <div className="ad-detail-footer">

              <button
                className="ad-close-btn"
                onClick={() =>
                  setSelectedAsset(null)
                }
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

export default AssetDetails;
