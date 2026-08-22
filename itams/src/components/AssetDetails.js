import React, { useEffect, useState } from "react";
import "./AssetDetails.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

// ==========================================
// STATUS BADGE CLASSES
// ==========================================
const STATUS_CLASS = {
  Available: "ad-badge--active",
  "In Use": "ad-badge--inuse",
  Maintenance: "ad-badge--maintenance",
};

// ==========================================
// ASSET TYPE OPTIONS
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
// STATUS OPTIONS
// ==========================================
const STATUS_OPTIONS = [
  "All Status",
  "Available",
  "In Use",
  "Maintenance",
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const AssetDetails = ({
  username = "username",
  onLogout,
  onBack,
}) => {
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
  const [filterCat, setFilterCat] = useState("All Asset Types");
  const [filterStat, setFilterStat] = useState("All Status");

  const [searchError, setSearchError] = useState("");
  const [showFieldError, setShowFieldError] = useState(false);

  // ==========================================
  // TABLE
  // ==========================================
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ==========================================
  // VIEW ASSET
  // ==========================================
  const [selectedAsset, setSelectedAsset] = useState(null);

  // ==========================================
  // FIXED FILTER OPTIONS
  // ==========================================
  const categories = ASSET_TYPE_OPTIONS;
  const statuses = STATUS_OPTIONS;

  // ==========================================
  // NORMALIZE STATUS
  // ==========================================
  const normalizeStatus = (status) => {
    if (!status) {
      return "";
    }

    const value = String(status).trim().toLowerCase();

    if (
      value === "available" ||
      value === "active" ||
      value === "not in use"
    ) {
      return "Available";
    }

    if (value === "in use") {
      return "In Use";
    }

    if (
      value === "maintenance" ||
      value === "under maintenance"
    ) {
      return "Maintenance";
    }

    return status;
  };

  // ==========================================
  // FETCH ASSETS FROM BACKEND
  // ==========================================
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const token = localStorage.getItem("token");

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch assets"
        );
      }

      setAssets(data.assets || []);
    } catch (error) {
      console.error("Fetch Assets Error:", error);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // SEARCH VALIDATION
  // ==========================================
  const validateSearchText = () => {
    const value = searchText;

    // Empty search
    if (value.length === 0) {
      return "Please enter an Asset ID";
    }

    // Exactly 6 characters
    if (value.length !== 6) {
      return "Asset ID must contain exactly 6 characters";
    }

    // First 3 CAPITAL letters + last 3 numbers
    if (!/^[A-Z]{3}[0-9]{3}$/.test(value)) {
      return "Asset ID must be 3 capital letters followed by 3 numbers (Example: LAP001)";
    }

    return "";
  };

  // ==========================================
  // STATUS VALIDATION
  // ==========================================
  const validateStatus = () => {
    const validStatuses = [
      "All Status",
      "Available",
      "In Use",
      "Maintenance",
    ];

    if (!validStatuses.includes(filterStat)) {
      return "Please select a valid asset status";
    }

    return "";
  };

  // ==========================================
  // SEARCH VALIDATION
  // ==========================================
  const validateSearch = () => {
    setSearchError("");
    setShowFieldError(false);

    // Validate status
    const statusError = validateStatus();

    if (statusError) {
      setSearchError(statusError);
      setShowFieldError(true);
      return false;
    }

    const hasSearch = searchText.length > 0;

    const hasFilter =
      filterCat !== "All Asset Types" ||
      filterStat !== "All Status";

    // Nothing entered or selected
    if (!hasSearch && !hasFilter) {
      setSearchError(
        "Please enter an Asset ID or select a filter."
      );

      setShowFieldError(true);
      return false;
    }

    // Validate Asset ID if entered
    if (hasSearch) {
      const searchValidationError =
        validateSearchText();

      if (searchValidationError) {
        setSearchError(searchValidationError);
        setShowFieldError(true);
        return false;
      }
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
  // ONLY:
  // 3 CAPITAL LETTERS + 3 NUMBERS
  // Example: LAP001
  // ==========================================
  const handleSearchChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    setSearchText(value);
    setSearchError("");
    setShowFieldError(false);
  };

  // ==========================================
  // FILTER CHANGE
  // ==========================================
  const handleFilterChange = (setter) => (e) => {
    const value = e.target.value;

    setter(value);

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
    setFilterCat("All Asset Types");
    setFilterStat("All Status");
    setSearchError("");
    setShowFieldError(false);
  };

  // ==========================================
  // FILTER DATABASE DATA
  // SEARCH ONLY BY ASSET ID
  // ==========================================
  const filtered = assets.filter((asset) => {
    const search = searchText.toUpperCase();

    // ========================================
    // ASSET ID MATCH ONLY
    // ========================================
    const assetId = String(
      asset.asset_id || ""
    ).toUpperCase();

    const matchSearch =
      search === "" ||
      assetId.includes(search);

    // ========================================
    // ASSET TYPE MATCH
    // ========================================
    const matchCategory =
      filterCat === "All Asset Types" ||
      (asset.asset_type || "").toLowerCase() ===
        filterCat.toLowerCase();

    // ========================================
    // STATUS MATCH
    // ========================================
    const normalizedAssetStatus =
      normalizeStatus(asset.status);

    const matchStatus =
      filterStat === "All Status" ||
      normalizedAssetStatus === filterStat;

    return (
      matchSearch &&
      matchCategory &&
      matchStatus
    );
  });

  // ==========================================
  // DISPLAYED ROWS
  // ==========================================
  const displayed =
    rowsPerPage === "All"
      ? filtered
      : filtered.slice(0, rowsPerPage);

  // ==========================================
  // STATISTICS
  // ==========================================
  const totalAssets = assets.length;

  const available = assets.filter(
    (asset) =>
      normalizeStatus(asset.status) ===
      "Available"
  ).length;

  const inUse = assets.filter(
    (asset) =>
      normalizeStatus(asset.status) ===
      "In Use"
  ).length;

  const maintenance = assets.filter(
    (asset) =>
      normalizeStatus(asset.status) ===
      "Maintenance"
  ).length;

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
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

      {/* TOP NAVBAR */}
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

      {/* BODY */}
      <div className="ad-body-wrapper">

        {/* MAIN CONTENT */}
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

          {/* STAT CARDS */}
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
                Available
              </span>

              <span className="ad-stat-value">
                {available}
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
                Maintenance
              </span>

              <span className="ad-stat-value">
                {maintenance}
              </span>

            </div>

          </div>

          {/* SEARCH / FILTER */}
          <div className="ad-filters-row">

            {/* SEARCH ASSET ID */}
            <div
              className={`ad-search-wrapper ${
                showFieldError
                  ? "ad-search-wrapper--error"
                  : ""
              }`}
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
                className={`ad-search-input ${
                  showFieldError
                    ? "ad-input--error"
                    : ""
                }`}
                type="text"
                placeholder="Search Asset ID"
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                maxLength={6}
              />

            </div>

            {/* ASSET TYPE DROPDOWN */}
            <select
              className={`ad-filter-select ${
                showFieldError
                  ? "ad-input--error"
                  : ""
              }`}
              value={filterCat}
              onChange={handleFilterChange(
                setFilterCat
              )}
            >

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

            {/* STATUS DROPDOWN */}
            <select
              className={`ad-filter-select ${
                showFieldError
                  ? "ad-input--error"
                  : ""
              }`}
              value={filterStat}
              onChange={handleFilterChange(
                setFilterStat
              )}
            >

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}

            </select>

            {/* SEARCH BUTTON */}
            <button
              className="ad-search-btn"
              onClick={applyFilters}
            >
              Search
            </button>

            {/* RESET BUTTON */}
            <button
              className="ad-reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

          {/* SEARCH ERROR */}
          {searchError && (
            <div className="ad-error-container">

              <span className="ad-error-text">
                ⚠️ {searchError}
              </span>

            </div>
          )}

          {/* FETCH ERROR */}
          {fetchError && (
            <div className="ad-error-container">

              <span className="ad-error-text">
                ⚠️ {fetchError}
              </span>

            </div>
          )}

          {/* BACK BUTTON */}
          <div className="ad-back-row">

            <button
              className="ad-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>

          {/* LOADING / TABLE */}
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

                    displayed.map((asset) => (

                      <tr
                        key={asset.asset_id}
                      >

                        {/* ASSET ID */}
                        <td>

                          <span className="ad-asset-id">
                            {asset.asset_id}
                          </span>

                        </td>

                        {/* ASSET TYPE */}
                        <td>
                          {asset.asset_type || "-"}
                        </td>

                        {/* STATUS */}
                        <td>

                          <span
                            className={`ad-badge ${
                              STATUS_CLASS[
                                normalizeStatus(
                                  asset.status
                                )
                              ] || ""
                            }`}
                          >
                            {normalizeStatus(
                              asset.status
                            ) || "-"}
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

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* TABLE FOOTER */}
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

              {ROWS_OPTIONS.map((option) => (

                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>

              ))}

            </select>

          </div>

        </main>

      </div>

      {/* ASSET DETAIL MODAL */}
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
                  normalizeStatus(
                    selectedAsset.status
                  ),
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

              ].map(([label, value]) => (

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

              ))}

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
