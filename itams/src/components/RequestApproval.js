import React, { useState } from "react";
import "./RequestApproval.css";

const ASSET_TYPES = ["All Assets", "Laptop", "Monitor", "Keyboard", "Mouse", "Printer", "Desktop"];
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

// Validation for Search
const validateSearch = (empId, assetType) => {
  const hasEmpId = empId && empId.trim() !== "";
  const hasAssetType = assetType && assetType !== "All Assets";
  
  if (!hasEmpId && !hasAssetType) {
    return { isValid: false, message: "Please enter an Employee ID or select an Asset Type to search" };
  }
  
  if (hasEmpId) {
    const result = validateEmployeeId(empId);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true, message: "" };
};

// ==========================================
// INITIAL DATA
// ==========================================
const INITIAL_REQUESTS = [
  {
    id: "AR001",
    employeeId: "EMP001",
    employeeName: "Employee 1",
    department: "IT",
    assetType: "Laptop",
    purpose: "Development Work",
    requiredDate: "10-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: "AR002",
    employeeId: "EMP004",
    employeeName: "Employee 4",
    department: "HR",
    assetType: "Monitor",
    purpose: "New Employees",
    requiredDate: "12-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: "AR003",
    employeeId: "EMP010",
    employeeName: "Employee 10",
    department: "Finance",
    assetType: "Keyboard",
    purpose: "Replacement",
    requiredDate: "15-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const RequestApproval = ({ 
  username = "username", 
  onLogout, 
  onBack, 
  onSidebarNavigate 
}) => {
  const [activeSidebar, setActiveSidebar] = useState("request-approval");

  // Search state
  const [searchEmpId, setSearchEmpId]   = useState("");
  const [searchType, setSearchType]     = useState("All Assets");
  const [appliedEmpId, setAppliedEmpId] = useState("");
  const [appliedType, setAppliedType]   = useState("All Assets");
  const [searchError, setSearchError]   = useState("");
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  // Table state
  const [requests, setRequests]         = useState(INITIAL_REQUESTS);
  const [rowsPerPage, setRowsPerPage]   = useState(10);
  const [selectedReq, setSelectedReq]   = useState(null);

  // Rejection reason
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError]         = useState("");

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
    console.log("RequestApproval sidebar clicked:", item.id);
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

    const result = validateSearch(searchEmpId, searchType);
    if (!result.isValid) {
      setSearchError(result.message);
      setAppliedEmpId("");
      setAppliedType("All Assets");
      return;
    }

    setAppliedEmpId(searchEmpId.trim().toUpperCase());
    setAppliedType(searchType);
    setSearchError("");
  };

  const handleSearchChange = (e) => {
    setSearchEmpId(e.target.value);
    setSearchError("");
    setIsSearchTouched(false);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchError("");
    setIsSearchTouched(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const filtered = requests.filter((r) => {
    const empMatch  = appliedEmpId ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) : true;
    const typeMatch = appliedType === "All Assets" ? true : r.assetType === appliedType;
    return empMatch && typeMatch;
  });

  const displayed = rowsPerPage === "All" ? filtered : filtered.slice(0, rowsPerPage);

  // ==========================================
  // SELECT REQUEST
  // ==========================================
  const selectRequest = (req) => {
    setSelectedReq(req);
    setRejectionReason(req.rejectionReason || "");
    setRejectError("");
  };

  // ==========================================
  // APPROVE
  // ==========================================
  const handleApprove = () => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((r) => r.id === selectedReq.id ? { ...r, status: "Approved" } : r)
    );
    setSelectedReq((prev) => ({ ...prev, status: "Approved" }));
    setRejectionReason("");
    setRejectError("");
    alert(`✅ Request ${selectedReq.id} approved successfully!`);
  };

  // ==========================================
  // REJECT WITH VALIDATION
  // ==========================================
  const handleReject = () => {
    if (!selectedReq) return;
    
    // ✅ Validate rejection reason
    if (!rejectionReason.trim()) {
      setRejectError("Reason for rejection is required.");
      return;
    }
    
    if (rejectionReason.trim().length < 5) {
      setRejectError("Reason for rejection must be at least 5 characters long.");
      return;
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id ? { ...r, status: "Rejected", rejectionReason } : r
      )
    );
    setSelectedReq((prev) => ({ ...prev, status: "Rejected", rejectionReason }));
    setRejectError("");
    alert(`❌ Request ${selectedReq.id} rejected.`);
  };

  const statusClass = (s) => {
    if (s === "Approved") return "ra-badge--approved";
    if (s === "Rejected") return "ra-badge--rejected";
    return "ra-badge--pending";
  };

  return (
    <div className="ra-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="ra-top-nav">
        <div className="ra-nav-logo">
          <span className="ra-nav-logo-title">ITAMS</span>
          <span className="ra-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="ra-nav-right">
          <span className="ra-nav-username">{username}</span>
          <div className="ra-nav-divider" />
          <button className="ra-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="ra-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="ra-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ra-sidebar-item" +
                (activeSidebar === item.id ? " ra-sidebar-item--active" : "")
              }
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="ra-main-content">
          <h1 className="ra-page-title">Request Approval</h1>
          <p className="ra-page-subtitle">
            Review and approve or reject asset requests.
          </p>

          {/* ── Search Request Card with Validation ── */}
          <div className="ra-card">
            <h2 className="ra-card-heading">Search Request</h2>
            <div className="ra-search-row">
              <div className="ra-field-group">
                <label className="ra-field-label">Employee ID</label>
                <input
                  className={`ra-input ${searchError && isSearchTouched ? "ra-input-error" : ""}`}
                  type="text"
                  placeholder="Enter employee ID"
                  value={searchEmpId}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              <div className="ra-field-group">
                <label className="ra-field-label">Asset Type</label>
                <select
                  className={`ra-select ${searchError && isSearchTouched ? "ra-input-error" : ""}`}
                  value={searchType}
                  onChange={handleSearchTypeChange}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button className="ra-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
            {searchError && isSearchTouched && (
              <div className="ra-search-error">⚠️ {searchError}</div>
            )}
            <div className="ra-validation-hint">
              <small>Format: EMP + 3 alphanumeric (e.g., EMP001, EMPA12, EMP1AB)</small>
            </div>
          </div>

          {/* ── Pending Request List Card ── */}
          <div className="ra-card ra-card--table">
            <h2 className="ra-card-heading">Pending Request List</h2>

            <div className="ra-table-wrapper">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Asset Type</th>
                    <th>Purpose</th>
                    <th>Required Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ra-no-data">No requests found.</td>
                    </tr>
                  ) : (
                    displayed.map((req) => (
                      <tr
                        key={req.id}
                        className={
                          "ra-table-row" +
                          (selectedReq && selectedReq.id === req.id ? " ra-table-row--selected" : "")
                        }
                        onClick={() => selectRequest(req)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{req.id}</td>
                        <td>
                          <span className="ra-employee-id">{req.employeeId}</span>
                        </td>
                        <td>{req.assetType}</td>
                        <td>{req.purpose}</td>
                        <td>{req.requiredDate}</td>
                        <td>
                          <span className={`ra-badge ${statusClass(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="ra-rows-right">
              <span className="ra-pagination-info">
                Showing {displayed.length} of {filtered.length} requests
              </span>
              <select
                className="ra-rows-select"
                value={rowsPerPage}
                onChange={(e) => {
                  const v = e.target.value;
                  setRowsPerPage(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Request Details Card ── */}
          {selectedReq && (
            <div className="ra-card ra-card--details">
              <h2 className="ra-card-heading">Request Details</h2>

              <div className="ra-details-grid">
                {/* Left column */}
                <div className="ra-details-col">
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Request ID</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.id}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Employee ID</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.employeeId}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Employee Name</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.employeeName}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Department</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.department}</span>
                  </div>
                </div>

                {/* Middle column */}
                <div className="ra-details-col">
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Asset Type</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.assetType}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Purpose</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.purpose}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Required Date</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.requiredDate}</span>
                  </div>
                </div>

                {/* Right column — status + approve */}
                <div className="ra-details-col ra-details-col--right">
                  <div className="ra-status-row">
                    <span className="ra-detail-label">Request Status</span>
                    <span className="ra-detail-sep">:</span>
                    <span className={`ra-badge ${statusClass(selectedReq.status)}`}>
                      {selectedReq.status}
                    </span>
                  </div>
                  <button
                    className="ra-approve-btn"
                    onClick={handleApprove}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  >
                    Approve
                  </button>
                </div>
              </div>

              {/* Rejection section */}
              <div className="ra-rejection-section">
                <label className="ra-rejection-label">
                  Reason for Rejection{" "}
                  <span className="ra-rejection-hint">(required if rejecting)</span>
                </label>
                <div className="ra-rejection-row">
                  <textarea
                    className={`ra-textarea${rejectError ? " ra-textarea--error" : ""}`}
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      setRejectError("");
                    }}
                    rows={3}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  />
                  <button
                    className="ra-reject-btn"
                    onClick={handleReject}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  >
                    Reject
                  </button>
                </div>
                {rejectError && <span className="ra-error">⚠️ {rejectError}</span>}
                <div className="ra-validation-hint">
                  <small>Minimum 5 characters required for rejection reason</small>
                </div>
              </div>
            </div>
          )}

          {/* ── Back Button ── */}
          <div className="ra-footer-row">
            <button className="ra-back-btn" onClick={onBack}>← Back</button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default RequestApproval;
