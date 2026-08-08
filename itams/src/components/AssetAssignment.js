import React, { useState } from "react";
import "./AssetAssignment.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

// Validation for Employee ID
const validateEmployeeId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Employee ID is required" };
  }
  if (id !== id.trim()) {
    return { isValid: false, message: "Employee ID should not have leading or trailing spaces" };
  }
  if (/\s/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain spaces" };
  }
  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain special characters" };
  }
  if (!id.startsWith("EMP")) {
    return { isValid: false, message: "Employee ID must start with 'EMP'" };
  }
  if (id.length !== 6) {
    return { isValid: false, message: "Employee ID must be exactly 6 characters long (EMP + 3 alphanumeric characters)" };
  }
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }
  return { isValid: true, message: "" };
};

// Validation for Asset ID
const validateAssetId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Asset ID is required" };
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
    return { isValid: false, message: "Asset ID must start with 'AST'" };
  }
  if (id.length !== 6) {
    return { isValid: false, message: "Asset ID must be exactly 6 characters long (AST + 3 alphanumeric characters)" };
  }
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }
  return { isValid: true, message: "" };
};

// ==========================================
// INITIAL DATA
// ==========================================

// Approved requests not yet assigned
const INITIAL_PENDING = [
  {
    requestId:    "AR001",
    employeeId:   "EMP001",
    employeeName: "Employee 1",
    department:   "IT",
    assetType:    "Laptop",
    purpose:      "Development Work",
    requiredDate: "10-08-2026",
    approvalDate: "08-08-2026",
  },
  {
    requestId:    "AR004",
    employeeId:   "EMP004",
    employeeName: "Employee 4",
    department:   "HR",
    assetType:    "Monitor",
    purpose:      "New Employees",
    requiredDate: "12-08-2026",
    approvalDate: "09-08-2026",
  },
  {
    requestId:    "AR006",
    employeeId:   "EMP007",
    employeeName: "Employee 7",
    department:   "Finance",
    assetType:    "Printer",
    purpose:      "Office Work",
    requiredDate: "14-08-2026",
    approvalDate: "10-08-2026",
  },
];

// Already assigned assets — history
const INITIAL_HISTORY = [
  {
    assignmentId: "ASG001",
    requestId:    "AR002",
    employeeId:   "EMP002",
    employeeName: "Employee 2",
    assetType:    "Laptop",
    assetNameId:  "Dell Latitude 5420 (AST1001)",
    assignedDate: "09-08-2026",
    status:       "Assigned",
  },
  {
    assignmentId: "ASG002",
    requestId:    "AR003",
    employeeId:   "EMP003",
    employeeName: "Employee 3",
    assetType:    "Keyboard",
    assetNameId:  "Logitech K120 (AST2007)",
    assignedDate: "10-08-2026",
    status:       "Assigned",
  },
  {
    assignmentId: "ASG003",
    requestId:    "AR005",
    employeeId:   "EMP005",
    employeeName: "Employee 5",
    assetType:    "Monitor",
    assetNameId:  'HP 24" Monitor (AST3004)',
    assignedDate: "11-08-2026",
    status:       "Assigned",
  },
];

// Simple assignment ID counter
let assignCounter = INITIAL_HISTORY.length + 1;

// ==========================================
// MAIN COMPONENT
// ==========================================
const AssetAssignment = ({ 
  username = "username", 
  onLogout, 
  onBack, 
  onSidebarNavigate 
}) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-assignment");

  // Search state
  const [searchEmpId, setSearchEmpId]     = useState("");
  const [appliedEmpId, setAppliedEmpId]   = useState("");
  const [searchError, setSearchError]     = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  // Table data
  const [pending, setPending]   = useState(INITIAL_PENDING);
  const [history, setHistory]   = useState(INITIAL_HISTORY);

  // Rows per page — separate for each table
  const [pendingRows, setPendingRows] = useState(10);
  const [historyRows, setHistoryRows] = useState(10);

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assetNameId, setAssetNameId] = useState("");
  const [assetNameError, setAssetNameError] = useState("");

  const sidebarItems = [
    { id: "dashboard",        label: "Dashboard"        },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance",      label: "Maintenance"      },
  ];

  // ==========================================
  // SIDEBAR CLICK HANDLER - FIXED
  // ==========================================
  const handleSidebarClick = (item) => {
    console.log("AssetAssignment sidebar clicked:", item.id);
    setActiveSidebar(item.id);
    
    // ✅ NOTIFY PARENT ABOUT NAVIGATION
    if (onSidebarNavigate) {
      onSidebarNavigate(item.id);
    }
  };

  // ==========================================
  // SEARCH WITH VALIDATION
  // ==========================================
  const handleSearch = () => {
    setIsSearchTouched(true);
    setSearchError("");

    if (searchEmpId.trim() === "") {
      setSearchError("Please enter an Employee ID to search");
      setIsSearchValid(false);
      setAppliedEmpId("");
      return;
    }

    const result = validateEmployeeId(searchEmpId);
    if (!result.isValid) {
      setSearchError(result.message);
      setIsSearchValid(false);
      setAppliedEmpId("");
      return;
    }

    setAppliedEmpId(searchEmpId.trim().toUpperCase());
    setIsSearchValid(true);
    setSearchError("");
  };

  const handleSearchChange = (e) => {
    setSearchEmpId(e.target.value);
    setSearchError("");
    setIsSearchValid(true);
    setIsSearchTouched(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const filteredPending = pending.filter((r) =>
    appliedEmpId
      ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(appliedEmpId.toLowerCase())
      : true
  );

  const filteredHistory = history.filter((r) =>
    appliedEmpId
      ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(appliedEmpId.toLowerCase())
      : true
  );

  const displayedPending = pendingRows === "All" ? filteredPending : filteredPending.slice(0, pendingRows);
  const displayedHistory = historyRows === "All" ? filteredHistory : filteredHistory.slice(0, historyRows);

  // ==========================================
  // ASSIGN FUNCTIONALITY WITH VALIDATION
  // ==========================================
  const openAssignModal = (req) => {
    setSelectedRequest(req);
    setAssetNameId("");
    setAssetNameError("");
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRequest(null);
    setAssetNameId("");
    setAssetNameError("");
  };

  const validateAssetNameId = () => {
    if (!assetNameId.trim()) {
      setAssetNameError("Asset Name/ID is required");
      return false;
    }
    
    if (assetNameId.trim().startsWith("AST")) {
      const result = validateAssetId(assetNameId.trim());
      if (!result.isValid) {
        setAssetNameError(result.message);
        return false;
      }
    }
    
    if (assetNameId.trim().length < 3) {
      setAssetNameError("Asset Name/ID must be at least 3 characters long");
      return false;
    }
    
    return true;
  };

  const confirmAssign = () => {
    if (!validateAssetNameId()) {
      return;
    }

    const padded = String(assignCounter).padStart(3, "0");
    const today  = new Date();
    const assignedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    const newEntry = {
      assignmentId: `ASG${padded}`,
      requestId:    selectedRequest.requestId,
      employeeId:   selectedRequest.employeeId,
      employeeName: selectedRequest.employeeName,
      assetType:    selectedRequest.assetType,
      assetNameId:  assetNameId.trim(),
      assignedDate,
      status:       "Assigned",
    };

    assignCounter += 1;
    setPending((prev) => prev.filter((r) => r.requestId !== selectedRequest.requestId));
    setHistory((prev) => [newEntry, ...prev]);
    
    alert(`✅ Asset assigned successfully!\nAssignment ID: ${newEntry.assignmentId}\nAsset: ${newEntry.assetNameId}`);
    closeAssignModal();
  };

  return (
    <div className="asa-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="asa-top-nav">
        <div className="asa-nav-logo">
          <span className="asa-nav-logo-title">ITAMS</span>
          <span className="asa-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="asa-nav-right">
          <span className="asa-nav-username">{username}</span>
          <div className="asa-nav-divider" />
          <button className="asa-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="asa-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="asa-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "asa-sidebar-item" +
                (activeSidebar === item.id ? " asa-sidebar-item--active" : "")
              }
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="asa-main-content">
          <h1 className="asa-page-title">Asset Assignment</h1>
          <p className="asa-page-subtitle">
            Assign approved asset requests to employees.
          </p>

          {/* ── Search by Employee ID with Validation ── */}
          <div className="asa-search-section">
            <label className="asa-search-label">Search by Employee ID</label>
            <div className="asa-search-row">
              <input
                className={`asa-input ${(!isSearchValid && isSearchTouched) || (searchError && isSearchTouched) ? "asa-input-error" : ""}`}
                type="text"
                placeholder="Enter Employee ID (e.g., EMP001)"
                value={searchEmpId}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              <button className="asa-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
            {searchError && isSearchTouched && (
              <div className="asa-search-error">⚠️ {searchError}</div>
            )}
            <div className="asa-validation-hint">
              <small>Format: EMP + 3 alphanumeric characters (e.g., EMP001, EMPA12, EMP1AB)</small>
            </div>
          </div>

          {/* ── Pending Requests Table ── */}
          <div className="asa-card">
            <h2 className="asa-card-heading">
              Request Approved Information (Not Yet Assigned)
            </h2>
            <div className="asa-table-wrapper">
              <table className="asa-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Asset Type</th>
                    <th>Purpose</th>
                    <th>Required Date</th>
                    <th>Approval Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPending.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="asa-no-data">
                        No pending requests found.
                      </td>
                    </tr>
                  ) : (
                    displayedPending.map((req) => (
                      <tr key={req.requestId}>
                        <td>{req.requestId}</td>
                        <td>
                          <span className="asa-employee-id">{req.employeeId}</span>
                        </td>
                        <td>{req.employeeName}</td>
                        <td>{req.department}</td>
                        <td>{req.assetType}</td>
                        <td>{req.purpose}</td>
                        <td>{req.requiredDate}</td>
                        <td>{req.approvalDate}</td>
                        <td>
                          <button
                            className="asa-assign-btn"
                            onClick={() => openAssignModal(req)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="asa-rows-right">
              <span className="asa-pagination-info">
                Showing {displayedPending.length} of {filteredPending.length} requests
              </span>
              <select
                className="asa-rows-select"
                value={pendingRows}
                onChange={(e) => {
                  const v = e.target.value;
                  setPendingRows(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Assignment History Table ── */}
          <div className="asa-card">
            <h2 className="asa-card-heading">
              Assignment History (Already Assigned Assets)
            </h2>
            <div className="asa-table-wrapper">
              <table className="asa-table">
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Asset Type</th>
                    <th>Asset Name / ID</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="asa-no-data">
                        No assignment history found.
                      </td>
                    </tr>
                  ) : (
                    displayedHistory.map((entry) => (
                      <tr key={entry.assignmentId}>
                        <td>{entry.assignmentId}</td>
                        <td>{entry.requestId}</td>
                        <td>
                          <span className="asa-employee-id">{entry.employeeId}</span>
                        </td>
                        <td>{entry.employeeName}</td>
                        <td>{entry.assetType}</td>
                        <td>{entry.assetNameId}</td>
                        <td>{entry.assignedDate}</td>
                        <td>
                          <span className="asa-badge asa-badge--assigned">
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="asa-rows-right">
              <span className="asa-pagination-info">
                Showing {displayedHistory.length} of {filteredHistory.length} records
              </span>
              <select
                className="asa-rows-select"
                value={historyRows}
                onChange={(e) => {
                  const v = e.target.value;
                  setHistoryRows(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Back Button ── */}
          <div className="asa-footer-row">
            <button className="asa-back-btn" onClick={onBack}>← Back</button>
          </div>

        </main>
      </div>

      {/* ── Assign Modal ── */}
      {showAssignModal && selectedRequest && (
        <div className="asa-modal-overlay" onClick={closeAssignModal}>
          <div className="asa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="asa-modal-header">
              <h2 className="asa-modal-title">Assign Asset</h2>
              <button className="asa-modal-close" onClick={closeAssignModal}>✕</button>
            </div>
            
            <div className="asa-modal-body">
              <div className="asa-modal-field">
                <label className="asa-modal-label">Request ID</label>
                <span className="asa-modal-value">{selectedRequest.requestId}</span>
              </div>
              <div className="asa-modal-field">
                <label className="asa-modal-label">Employee ID</label>
                <span className="asa-modal-value">{selectedRequest.employeeId}</span>
              </div>
              <div className="asa-modal-field">
                <label className="asa-modal-label">Employee Name</label>
                <span className="asa-modal-value">{selectedRequest.employeeName}</span>
              </div>
              <div className="asa-modal-field">
                <label className="asa-modal-label">Asset Type</label>
                <span className="asa-modal-value">{selectedRequest.assetType}</span>
              </div>
              <div className="asa-modal-field">
                <label className="asa-modal-label">Asset Name / ID *</label>
                <input
                  className={`asa-modal-input ${assetNameError ? "asa-input-error" : ""}`}
                  type="text"
                  placeholder="Enter Asset Name or ID (e.g., AST001)"
                  value={assetNameId}
                  onChange={(e) => {
                    setAssetNameId(e.target.value);
                    setAssetNameError("");
                  }}
                />
                {assetNameError && (
                  <span className="asa-modal-error">⚠️ {assetNameError}</span>
                )}
                <div className="asa-validation-hint">
                  <small>Format: AST + 3 alphanumeric (e.g., AST001, ASTA12, AST1AB) or enter asset name</small>
                </div>
              </div>
            </div>

            <div className="asa-modal-footer">
              <button className="asa-modal-cancel" onClick={closeAssignModal}>
                Cancel
              </button>
              <button className="asa-modal-confirm" onClick={confirmAssign}>
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetAssignment;
