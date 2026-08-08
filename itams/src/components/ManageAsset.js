import React, { useState } from "react";
import "./ManageAsset.css";

const ASSET_TYPES = ["All Assets", "Monitor", "Keyboard", "Laptop", "Mouse", "Printer", "Desktop", "Headset", "Webcam", "Scanner", "Projector"];
const ROWS_PER_PAGE_OPTIONS = [10, 30, 50, "All"];

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

// Validation for Asset ID
const validateAssetId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: true, message: "" };
  }
  if (id !== id.trim()) {
    return { isValid: false, message: "Asset ID should not have leading or trailing spaces" };
  }
  if (/\s/.test(id)) {
    return { isValid: false, message: "Asset ID should not contain spaces" };
  }
  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Asset ID should not contain special characters" };
  }
  if (!id.startsWith("AST")) {
    return { isValid: false, message: "Asset ID must start with 'AST' (uppercase)" };
  }
  if (id.length !== 6) {
    return { isValid: false, message: "Asset ID must be exactly 6 characters long (AST + 3 alphanumeric)" };
  }
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }
  return { isValid: true, message: "" };
};

// Validation for Asset Name
const validateAssetName = (name) => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Asset name is required" };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: "Asset name must be at least 2 characters long" };
  }
  if (name.trim().length > 100) {
    return { isValid: false, message: "Asset name cannot exceed 100 characters" };
  }
  if (/[^A-Za-z0-9\s()-]/.test(name.trim())) {
    return { isValid: false, message: "Asset name contains invalid characters" };
  }
  return { isValid: true, message: "" };
};

// Validation for Asset Type
const validateAssetType = (type) => {
  if (!type || type === "All Assets") {
    return { isValid: false, message: "Please select a valid asset type" };
  }
  return { isValid: true, message: "" };
};

// Validation for Purchase Date
const validatePurchaseDate = (date) => {
  if (!date) {
    return { isValid: false, message: "Purchase date is required" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate > today) {
    return { isValid: false, message: "Purchase date cannot be in the future" };
  }
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 10);
  if (selectedDate < maxDate) {
    return { isValid: false, message: "Purchase date cannot be older than 10 years" };
  }
  return { isValid: true, message: "" };
};

// Validation for Warranty Expiry Date
const validateWarrantyExpiry = (date, purchaseDate) => {
  if (!date) {
    return { isValid: false, message: "Warranty expiry date is required" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);
  if (selectedDate > maxDate) {
    return { isValid: false, message: "Warranty expiry date cannot exceed 5 years from today" };
  }
  
  if (purchaseDate) {
    const purchase = new Date(purchaseDate);
    purchase.setHours(0, 0, 0, 0);
    if (selectedDate < purchase) {
      return { isValid: false, message: "Warranty expiry date must be after purchase date" };
    }
  }
  
  return { isValid: true, message: "" };
};

// ==========================================
// INITIAL DATA
// ==========================================
const INITIAL_ASSETS = [
  { id: "AST001", name: 'Dell 24" Monitor', type: "Monitor", purchaseDate: "2025-01-15", warrantyExpiry: "2027-01-15" },
  { id: "AST002", name: "HP Laptop", type: "Laptop", purchaseDate: "2026-02-15", warrantyExpiry: "2028-02-15" },
  { id: "AST003", name: "Logitech Keyboard", type: "Keyboard", purchaseDate: "2025-03-10", warrantyExpiry: "2026-03-10" },
  { id: "AST004", name: "HP Mouse", type: "Mouse", purchaseDate: "2026-04-05", warrantyExpiry: "2027-04-05" },
  { id: "AST005", name: "Canon Printer", type: "Printer", purchaseDate: "2025-05-20", warrantyExpiry: "2027-05-20" },
  { id: "AST006", name: "Samsung Monitor", type: "Monitor", purchaseDate: "2026-06-12", warrantyExpiry: "2028-06-12" },
  { id: "AST007", name: "Dell Desktop", type: "Desktop", purchaseDate: "2025-07-08", warrantyExpiry: "2027-07-08" },
  { id: "AST008", name: "Logitech Webcam", type: "Webcam", purchaseDate: "2026-08-01", warrantyExpiry: "2027-08-01" },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const ManageAsset = ({ 
  username = "username", 
  onLogout, 
  onBack, 
  onSidebarNavigate  // ← THIS IS THE KEY
}) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  // Search state
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("All Assets");
  const [appliedName, setAppliedName] = useState("");
  const [appliedType, setAppliedType] = useState("All Assets");
  const [searchError, setSearchError] = useState("");
  const [showFieldError, setShowFieldError] = useState(false);

  // Table state
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit modal state
  const [editAsset, setEditAsset] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editPurchaseDate, setEditPurchaseDate] = useState("");
  const [editWarrantyExpiry, setEditWarrantyExpiry] = useState("");
  const [editErrors, setEditErrors] = useState({});

  // Delete confirmation state
  const [deleteAsset, setDeleteAsset] = useState(null);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance", label: "Maintenance" },
  ];

  // ==========================================
  // SIDEBAR CLICK HANDLER - FIXED
  // ==========================================
  const handleSidebarClick = (item) => {
    console.log("ManageAsset sidebar clicked:", item.id);
    setActiveSidebar(item.id);
    
    // ✅ NOTIFY PARENT ABOUT NAVIGATION
    if (onSidebarNavigate) {
      onSidebarNavigate(item.id);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const handleSearch = () => {
    setSearchError("");
    setShowFieldError(false);
    
    const searchValue = searchName.trim();
    
    // CASE 1: Both fields empty
    if (!searchValue && searchType === "All Assets") {
      setSearchError("Please enter an Asset Name/ID or select an Asset Type to search");
      setShowFieldError(true);
      setAppliedName("");
      setAppliedType("All Assets");
      return;
    }
    
    // CASE 2: Name is empty but Type is selected
    if (!searchValue && searchType !== "All Assets") {
      setAppliedName("");
      setAppliedType(searchType);
      setSearchError("");
      setShowFieldError(false);
      return;
    }
    
    // CASE 3: Name is entered but Type is "All Assets"
    if (searchValue && searchType === "All Assets") {
      if (searchValue.startsWith("AST") || searchValue.length >= 3) {
        const result = validateAssetId(searchValue);
        if (!result.isValid) {
          setSearchError(result.message);
          setShowFieldError(true);
          setAppliedName("");
          setAppliedType("All Assets");
          return;
        }
      }
      setAppliedName(searchValue);
      setAppliedType("All Assets");
      setSearchError("");
      setShowFieldError(false);
      return;
    }
    
    // CASE 4: Both fields have values
    if (searchValue && searchType !== "All Assets") {
      if (searchValue.startsWith("AST") || searchValue.length >= 3) {
        const result = validateAssetId(searchValue);
        if (!result.isValid) {
          setSearchError(result.message);
          setShowFieldError(true);
          setAppliedName("");
          setAppliedType(searchType);
          return;
        }
      }
      setAppliedName(searchValue);
      setAppliedType(searchType);
      setSearchError("");
      setShowFieldError(false);
      return;
    }
    
    setAppliedName("");
    setAppliedType("All Assets");
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setSearchError("");
    setShowFieldError(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchError("");
    setShowFieldError(false);
  };

  const filteredAssets = assets.filter((a) => {
    const nameMatch = appliedName
      ? a.name.toLowerCase().includes(appliedName.toLowerCase()) ||
        a.id.toLowerCase().includes(appliedName.toLowerCase())
      : true;
    const typeMatch =
      appliedType === "All Assets" ? true : a.type === appliedType;
    return nameMatch && typeMatch;
  });

  const displayedAssets =
    rowsPerPage === "All" ? filteredAssets : filteredAssets.slice(0, rowsPerPage);

  // ==========================================
  // EDIT
  // ==========================================
  const openEdit = (asset) => {
    setEditAsset(asset);
    setEditName(asset.name);
    setEditType(asset.type);
    setEditPurchaseDate(asset.purchaseDate || "");
    setEditWarrantyExpiry(asset.warrantyExpiry || "");
    setEditErrors({});
  };

  const validateEditForm = () => {
    const newErrors = {};

    const nameResult = validateAssetName(editName);
    if (!nameResult.isValid) {
      newErrors.editName = nameResult.message;
    }

    const typeResult = validateAssetType(editType);
    if (!typeResult.isValid) {
      newErrors.editType = typeResult.message;
    }

    const purchaseResult = validatePurchaseDate(editPurchaseDate);
    if (!purchaseResult.isValid) {
      newErrors.editPurchaseDate = purchaseResult.message;
    }

    const warrantyResult = validateWarrantyExpiry(editWarrantyExpiry, editPurchaseDate);
    if (!warrantyResult.isValid) {
      newErrors.editWarrantyExpiry = warrantyResult.message;
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEdit = () => {
    if (!validateEditForm()) {
      const firstError = document.querySelector(".ma-input--error");
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    setAssets((prev) =>
      prev.map((a) =>
        a.id === editAsset.id 
          ? { 
              ...a, 
              name: editName.trim(), 
              type: editType,
              purchaseDate: editPurchaseDate,
              warrantyExpiry: editWarrantyExpiry
            } 
          : a
      )
    );
    setEditAsset(null);
    setEditErrors({});
    alert(`✅ Asset ${editAsset.id} updated successfully!`);
  };

  // ==========================================
  // DELETE
  // ==========================================
  const openDelete = (asset) => {
    setDeleteAsset(asset);
  };

  const confirmDelete = () => {
    setAssets((prev) => prev.filter((a) => a.id !== deleteAsset.id));
    setDeleteAsset(null);
    alert(`❌ Asset ${deleteAsset.id} deleted successfully!`);
  };

  // ==========================================
  // RENDER
  // ==========================================
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
              onClick={() => handleSidebarClick(item)}
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
                <label className="ma-field-label">Asset Name or ID</label>
                <input
                  className={`ma-input ${showFieldError ? "ma-input--error" : ""}`}
                  type="text"
                  placeholder="Enter asset name or ID (e.g., AST001)"
                  value={searchName}
                  onChange={handleSearchNameChange}
                  onKeyDown={handleSearchKeyDown}
                />
                <div className="ma-validation-hint">
                  <small>Format: AST + 3 alphanumeric (e.g., AST001, ASTA12, AST1AB)</small>
                </div>
              </div>
              <div className="ma-field-group">
                <label className="ma-field-label">Asset Type</label>
                <select
                  className={`ma-select ${showFieldError ? "ma-input--error" : ""}`}
                  value={searchType}
                  onChange={handleSearchTypeChange}
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
            {searchError && (
              <div className="ma-search-error-container">
                <span className="ma-error-text">⚠️ {searchError}</span>
              </div>
            )}
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
                    <th>Purchase Date</th>
                    <th>Warranty Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ma-no-data">
                        No assets found.
                      </td>
                    </tr>
                  ) : (
                    displayedAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td>
                          <span className="ma-asset-id">{asset.id}</span>
                        </td>
                        <td>{asset.name}</td>
                        <td>
                          <span className="ma-type-badge">{asset.type}</span>
                        </td>
                        <td>{asset.purchaseDate || "-"}</td>
                        <td>{asset.warrantyExpiry || "-"}</td>
                        <td className="ma-actions-cell">
                          <button
                            className="ma-btn-edit"
                            onClick={() => openEdit(asset)}
                          >
                            Edit
                          </button>
                          <button
                            className="ma-btn-delete"
                            onClick={() => openDelete(asset)}
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
                ← Back
              </button>
              <div className="ma-rows-select-group">
                <span className="ma-pagination-info">
                  Showing {displayedAssets.length} of {filteredAssets.length} assets
                </span>
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
            <p className="ma-modal-subtitle">Edit the details of the asset and update the information.</p>
            
            <div className="ma-modal-field">
              <label className="ma-field-label">Asset ID</label>
              <input
                className="ma-input ma-input--readonly"
                type="text"
                value={editAsset.id}
                readOnly
              />
            </div>

            <div className="ma-modal-field">
              <label className="ma-field-label">Asset Name *</label>
              <input
                className={`ma-input ${editErrors.editName ? "ma-input--error" : ""}`}
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditErrors({ ...editErrors, editName: "" });
                }}
                placeholder="Enter asset name"
              />
              {editErrors.editName && (
                <span className="ma-error-text">⚠️ {editErrors.editName}</span>
              )}
            </div>

            <div className="ma-modal-field">
              <label className="ma-field-label">Asset Type *</label>
              <select
                className={`ma-select ${editErrors.editType ? "ma-input--error" : ""}`}
                value={editType}
                onChange={(e) => {
                  setEditType(e.target.value);
                  setEditErrors({ ...editErrors, editType: "" });
                }}
              >
                {ASSET_TYPES.filter((t) => t !== "All Assets").map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {editErrors.editType && (
                <span className="ma-error-text">⚠️ {editErrors.editType}</span>
              )}
            </div>

            <div className="ma-modal-field">
              <label className="ma-field-label">Purchase Date</label>
              <input
                className={`ma-input ${editErrors.editPurchaseDate ? "ma-input--error" : ""}`}
                type="date"
                value={editPurchaseDate}
                onChange={(e) => {
                  setEditPurchaseDate(e.target.value);
                  setEditErrors({ ...editErrors, editPurchaseDate: "" });
                }}
              />
              {editErrors.editPurchaseDate && (
                <span className="ma-error-text">⚠️ {editErrors.editPurchaseDate}</span>
              )}
            </div>

            <div className="ma-modal-field">
              <label className="ma-field-label">Warranty Expiry Date</label>
              <input
                className={`ma-input ${editErrors.editWarrantyExpiry ? "ma-input--error" : ""}`}
                type="date"
                value={editWarrantyExpiry}
                onChange={(e) => {
                  setEditWarrantyExpiry(e.target.value);
                  setEditErrors({ ...editErrors, editWarrantyExpiry: "" });
                }}
              />
              {editErrors.editWarrantyExpiry && (
                <span className="ma-error-text">⚠️ {editErrors.editWarrantyExpiry}</span>
              )}
            </div>

            <div className="ma-modal-actions">
              <button className="ma-modal-cancel" onClick={() => {
                setEditAsset(null);
                setEditErrors({});
              }}>
                Cancel
              </button>
              <button className="ma-modal-save" onClick={saveEdit}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteAsset && (
        <div className="ma-modal-overlay" onClick={() => setDeleteAsset(null)}>
          <div className="ma-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ma-modal-title">Delete Asset</h2>
            <p className="ma-modal-msg">
              Are you sure you want to delete this asset?
            </p>
            <div className="ma-delete-details">
              <div className="ma-delete-row">
                <span className="ma-delete-label">Asset ID:</span>
                <span className="ma-delete-value">{deleteAsset.id}</span>
              </div>
              <div className="ma-delete-row">
                <span className="ma-delete-label">Asset Name:</span>
                <span className="ma-delete-value">{deleteAsset.name}</span>
              </div>
            </div>
            <div className="ma-modal-actions">
              <button className="ma-modal-cancel" onClick={() => setDeleteAsset(null)}>
                No
              </button>
              <button className="ma-modal-delete" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAsset;
