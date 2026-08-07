import React, { useState } from "react";
import "./AssetDetails.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

const INITIAL_ASSETS = [
  {
    id: "AST001",
    name: "Dell Laptop",
    category: "Laptop",
    brand: "Dell",
    model: "Inspiron 15",
    location: "IT Department",
    status: "In Use",
    assignedTo: "John Doe",
    purchaseDate: "15-01-2024",
    warrantyExpiry: "15-01-2027",
    serialNumber: "DL123456789",
    description: "Dell Inspiron 15 laptop with 8GB RAM, 512GB SSD, Windows 11.",
  },
  {
    id: "AST002",
    name: "HP Printer",
    category: "Printer",
    brand: "HP",
    model: "LaserJet Pro",
    location: "Admin Office",
    status: "In Use",
    assignedTo: "Jane Smith",
    purchaseDate: "10-02-2024",
    warrantyExpiry: "10-02-2027",
    serialNumber: "HP987654321",
    description: "HP LaserJet Pro printer for administrative office use.",
  },
  {
    id: "AST003",
    name: "Lenovo Desktop",
    category: "Desktop",
    brand: "Lenovo",
    model: "ThinkCentre",
    location: "IT Department",
    status: "Under Maintenance",
    assignedTo: "-",
    purchaseDate: "05-03-2024",
    warrantyExpiry: "05-03-2027",
    serialNumber: "LN112233445",
    description: "Lenovo ThinkCentre desktop undergoing hardware maintenance.",
  },
  {
    id: "AST004",
    name: "Epson Projector",
    category: "Projector",
    brand: "Epson",
    model: "EB-X41",
    location: "Conference Room",
    status: "In Use",
    assignedTo: "Robert Brown",
    purchaseDate: "20-03-2024",
    warrantyExpiry: "20-03-2026",
    serialNumber: "EP556677889",
    description: "Epson EB-X41 projector used in the main conference room.",
  },
  {
    id: "AST005",
    name: "Cisco Switch",
    category: "Network",
    brand: "Cisco",
    model: "SG350-28",
    location: "Server Room",
    status: "Not In Use",
    assignedTo: "-",
    purchaseDate: "12-04-2024",
    warrantyExpiry: "12-04-2027",
    serialNumber: "CS998877665",
    description: "Cisco SG350-28 managed switch currently not in service.",
  },
];

const CATEGORIES = ["All Categories", "Laptop", "Printer", "Desktop", "Projector", "Network"];
const STATUSES   = ["All Status", "In Use", "Under Maintenance", "Not In Use"];
const LOCATIONS  = ["All Locations", "IT Department", "Admin Office", "Conference Room", "Server Room"];

const STATUS_CLASS = {
  "In Use":              "ad-badge--inuse",
  "Under Maintenance":   "ad-badge--maintenance",
  "Not In Use":          "ad-badge--notinuse",
};

const AssetDetails = ({ username = "username", onLogout }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  // Filter state
  const [searchText, setSearchText]   = useState("");
  const [filterCat,  setFilterCat]    = useState("All Categories");
  const [filterStat, setFilterStat]   = useState("All Status");
  const [filterLoc,  setFilterLoc]    = useState("All Locations");

  // Table state
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail panel
  const [selectedAsset, setSelectedAsset] = useState(null);

  const sidebarItems = [
    { id: "dashboard",        label: "Dashboard"        },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance",      label: "Maintenance"      },
  ];

  // ── Stats ────────────────────────────────────────────────────
  const totalAssets      = INITIAL_ASSETS.length;
  const inUse            = INITIAL_ASSETS.filter((a) => a.status === "In Use").length;
  const underMaintenance = INITIAL_ASSETS.filter((a) => a.status === "Under Maintenance").length;
  const notInUse         = INITIAL_ASSETS.filter((a) => a.status === "Not In Use").length;

  // ── Filter ───────────────────────────────────────────────────
  const filtered = INITIAL_ASSETS.filter((a) => {
    const matchSearch =
      searchText === "" ||
      a.name.toLowerCase().includes(searchText.toLowerCase()) ||
      a.id.toLowerCase().includes(searchText.toLowerCase());
    const matchCat  = filterCat  === "All Categories" || a.category === filterCat;
    const matchStat = filterStat === "All Status"     || a.status   === filterStat;
    const matchLoc  = filterLoc  === "All Locations"  || a.location === filterLoc;
    return matchSearch && matchCat && matchStat && matchLoc;
  });

  const displayed = rowsPerPage === "All" ? filtered : filtered.slice(0, rowsPerPage);

  const handleReset = () => {
    setSearchText("");
    setFilterCat("All Categories");
    setFilterStat("All Status");
    setFilterLoc("All Locations");
  };

  return (
    <div className="ad-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="ad-top-nav">
        <div className="ad-nav-logo">
          <span className="ad-nav-logo-title">ITAMS</span>
          <span className="ad-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="ad-nav-right">
          <span className="ad-nav-username">{username}</span>
          <div className="ad-nav-divider" />
          <button className="ad-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="ad-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="ad-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ad-sidebar-item" +
                (activeSidebar === item.id ? " ad-sidebar-item--active" : "")
              }
              onClick={() => setActiveSidebar(item.id)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="ad-main-content">

          {/* Page heading + breadcrumb */}
          <h1 className="ad-page-title">Asset Details</h1>
          <div className="ad-breadcrumb">
            <span className="ad-breadcrumb-link">Dashboard</span>
            <span className="ad-breadcrumb-sep">&gt;</span>
            <span className="ad-breadcrumb-current">Asset Details</span>
          </div>

          {/* ── Stat Cards ── */}
          <div className="ad-stats-row">
            <div className="ad-stat-card">
              <span className="ad-stat-label">Total Assets</span>
              <span className="ad-stat-value">{totalAssets}</span>
            </div>
            <div className="ad-stat-card">
              <span className="ad-stat-label">In Use</span>
              <span className="ad-stat-value">{inUse}</span>
            </div>
            <div className="ad-stat-card">
              <span className="ad-stat-label">Under Maintenance</span>
              <span className="ad-stat-value">{underMaintenance}</span>
            </div>
            <div className="ad-stat-card">
              <span className="ad-stat-label">Not In Use</span>
              <span className="ad-stat-value">{notInUse}</span>
            </div>
          </div>

          {/* ── Search & Filters ── */}
          <div className="ad-filters-row">
            <div className="ad-search-wrapper">
              <svg className="ad-search-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8"/>
                <path d="M15 15l-3-3" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                className="ad-search-input"
                type="text"
                placeholder="Search assets..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <select className="ad-filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select className="ad-filter-select" value={filterStat} onChange={(e) => setFilterStat(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select className="ad-filter-select" value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>

            <button className="ad-reset-btn" onClick={handleReset}>Reset</button>
          </div>

          {/* ── Table ── */}
          <div className="ad-table-wrapper">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Purchase Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="ad-no-data">No assets found.</td>
                  </tr>
                ) : (
                  displayed.map((asset) => (
                    <tr key={asset.id}>
                      <td>{asset.id}</td>
                      <td>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td>{asset.brand}</td>
                      <td>{asset.model}</td>
                      <td>{asset.location}</td>
                      <td>
                        <span className={`ad-badge ${STATUS_CLASS[asset.status] || ""}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>{asset.assignedTo}</td>
                      <td>{asset.purchaseDate}</td>
                      <td>
                        <button
                          className="ad-view-btn"
                          onClick={() => setSelectedAsset(asset)}
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

          {/* ── Rows per page ── */}
          <div className="ad-table-footer">
            <select
              className="ad-rows-select"
              value={rowsPerPage}
              onChange={(e) => {
                const v = e.target.value;
                setRowsPerPage(v === "All" ? "All" : Number(v));
              }}
            >
              {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </main>
      </div>

      {/* ── Asset Detail Panel (modal) ── */}
      {selectedAsset && (
        <div
          className="ad-overlay"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="ad-detail-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ad-detail-header">
              <h2 className="ad-detail-title">Asset Details</h2>
              <button
                className="ad-detail-close"
                onClick={() => setSelectedAsset(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="ad-detail-body">
              {[
                ["Asset ID",        selectedAsset.id],
                ["Asset Name",      selectedAsset.name],
                ["Category",        selectedAsset.category],
                ["Brand",           selectedAsset.brand],
                ["Model",           selectedAsset.model],
                ["Serial Number",   selectedAsset.serialNumber],
                ["Location",        selectedAsset.location],
                ["Status",          selectedAsset.status],
                ["Assigned To",     selectedAsset.assignedTo],
                ["Purchase Date",   selectedAsset.purchaseDate],
                ["Warranty Expiry", selectedAsset.warrantyExpiry],
                ["Description",     selectedAsset.description],
              ].map(([label, value]) => (
                <div className="ad-detail-row" key={label}>
                  <span className="ad-detail-label">{label}</span>
                  <span className="ad-detail-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="ad-detail-footer">
              <button
                className="ad-close-btn"
                onClick={() => setSelectedAsset(null)}
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
