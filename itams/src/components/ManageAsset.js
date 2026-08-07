import React, { useState } from "react";
import "./ManageAsset.css";

const ASSET_TYPES = ["All Assets", "Monitor", "Keyboard", "Laptop", "Mouse", "Printer"];

const ROWS_PER_PAGE_OPTIONS = [10, 30, 50, "All"];

const INITIAL_ASSETS = [
  { id: "AST001", name: 'Dell 24" Monitor', type: "Monitor" },
  { id: "AST002", name: "HP Laptop",         type: "Laptop"   },
  { id: "AST003", name: "Logitech Keyboard", type: "Keyboard" },
  { id: "AST004", name: "HP Mouse",          type: "Mouse"    },
  { id: "AST005", name: "Canon Printer",     type: "Printer"  },
];

const ManageAsset = ({ username = "username", onLogout, onBack, onEditAsset }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  // Search state
  const [searchName, setSearchName]     = useState("");
  const [searchType, setSearchType]     = useState("All Assets");
  const [appliedName, setAppliedName]   = useState("");
  const [appliedType, setAppliedType]   = useState("All Assets");

  // Table state
  const [assets, setAssets]             = useState(INITIAL_ASSETS);
  const [rowsPerPage, setRowsPerPage]   = useState(10);

  // Edit modal state
  const [editAsset, setEditAsset]       = useState(null);
  const [editName, setEditName]         = useState("");
  const [editType, setEditType]         = useState("");

  // Delete confirmation state
  const [deleteId, setDeleteId]         = useState(null);

  const sidebarItems = [
    { id: "dashboard",         label: "Dashboard"         },
    { id: "asset-management",  label: "Asset Management"  },
    { id: "asset-assignment",  label: "Asset Assignment"  },
    { id: "request-approval",  label: "Request Approval"  },
    { id: "maintenance",       label: "Maintenance"       },
  ];

  // ── Filter ──────────────────────────────────────────────────
  const handleSearch = () => {
    setAppliedName(searchName.trim());
    setAppliedType(searchType);
  };

  const filteredAssets = assets.filter((a) => {
    const nameMatch = appliedName
      ? a.name.toLowerCase().includes(appliedName.toLowerCase())
      : true;
    const typeMatch =
      appliedType === "All Assets" ? true : a.type === appliedType;
    return nameMatch && typeMatch;
  });

  const displayedAssets =
    rowsPerPage === "All" ? filteredAssets : filteredAssets.slice(0, rowsPerPage);

  // ── Edit ────────────────────────────────────────────────────
  const openEdit = (asset) => {
    setEditAsset(asset);
    setEditName(asset.name);
    setEditType(asset.type);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === editAsset.id ? { ...a, name: editName.trim(), type: editType } : a
      )
    );
    setEditAsset(null);
  };

  // ── Delete ───────────────────────────────────────────────────
  const confirmDelete = () => {
    setAssets((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="ma-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="ma-top-nav">
        <div className="ma-nav-logo">
          <span className="ma-nav-logo-title">ITAMS</span>
          <span className="ma-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="ma-nav-right">
          <span className="ma-nav-username">{username}</span>
          <div className="ma-nav-divider" />
          <button className="ma-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="ma-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="ma-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ma-sidebar-item" +
                (activeSidebar === item.id ? " ma-sidebar-item--active" : "")
              }
              onClick={() => setActiveSidebar(item.id)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="ma-main-content">
          <h1 className="ma-page-title">Manage Asset</h1>
          <p className="ma-page-subtitle">
            Edit or delete existing IT assets in the organization.
          </p>

          {/* ── Search Card ── */}
          <div className="ma-card">
            <h2 className="ma-card-heading">Search Asset</h2>
            <div className="ma-search-row">
              <div className="ma-field-group">
                <label className="ma-field-label">Asset Name</label>
                <input
                  className="ma-input"
                  type="text"
                  placeholder="Enter asset name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="ma-field-group">
                <label className="ma-field-label">Asset Type</label>
                <select
                  className="ma-select"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button className="ma-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* ── Asset List Card ── */}
          <div className="ma-card ma-card--table">
            <h2 className="ma-card-heading">Asset List</h2>

            <div className="ma-table-wrapper">
              <table className="ma-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Asset Name</th>
                    <th>Asset Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ma-no-data">
                        No assets found.
                      </td>
                    </tr>
                  ) : (
                    displayedAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td>{asset.id}</td>
                        <td>{asset.name}</td>
                        <td>{asset.type}</td>
                        <td className="ma-actions-cell">
                          <button
                            className="ma-btn-edit"
                            onClick={() => onEditAsset ? onEditAsset(asset) : openEdit(asset)}
                          >
                            Edit
                          </button>
                          <button
                            className="ma-btn-delete"
                            onClick={() => setDeleteId(asset.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Table Footer ── */}
            <div className="ma-table-footer">
              <button className="ma-back-btn" onClick={onBack}>
                Back
              </button>
              <div className="ma-rows-select-group">
                <select
                  className="ma-rows-select"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRowsPerPage(val === "All" ? "All" : Number(val));
                  }}
                >
                  {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Edit Modal ── */}
      {editAsset && (
        <div className="ma-modal-overlay" onClick={() => setEditAsset(null)}>
          <div className="ma-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ma-modal-title">Edit Asset</h2>
            <div className="ma-modal-field">
              <label className="ma-field-label">Asset Name</label>
              <input
                className="ma-input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="ma-modal-field">
              <label className="ma-field-label">Asset Type</label>
              <select
                className="ma-select"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                {ASSET_TYPES.filter((t) => t !== "All Assets").map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="ma-modal-actions">
              <button className="ma-modal-cancel" onClick={() => setEditAsset(null)}>
                Cancel
              </button>
              <button className="ma-modal-save" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="ma-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="ma-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ma-modal-title">Delete Asset</h2>
            <p className="ma-modal-msg">
              Are you sure you want to delete asset <strong>{deleteId}</strong>?
              This action cannot be undone.
            </p>
            <div className="ma-modal-actions">
              <button className="ma-modal-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="ma-modal-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAsset;
